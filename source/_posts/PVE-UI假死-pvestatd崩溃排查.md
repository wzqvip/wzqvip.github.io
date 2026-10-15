---
title: "PVE 网页打不开、SSH 里 qm list 卡住：元凶是 pvestatd 崩溃后永不自愈"
date: 2026-10-16 02:00:00
categories:
  - ["Server"]
  - ["Homelab"]
  - ["Troubleshooting"]
tags:
  - "PVE"
  - "Proxmox"
  - "systemd"
  - "Linux"
  - "排障"
description: "PVE 网页 UI 假死、SSH 里 qm list 卡住不返回，但虚拟机照常运行，重启就好、过段时间又犯——这个困扰我几个月的毛病，根因是 pvestatd 崩溃后 systemd 从不把它拉起来。"
---

我的 PVE 有个持续了几个月的怪毛病：

- 网页 UI 转圈或直接打不开
- SSH 上去敲 `qm list`，**卡住不返回**，要等很久或干脆不出来
- **但里面的虚拟机一切正常，业务没断**
- 重启物理机后恢复，过一段时间又犯
- 旧版本有，升级之后依然有

这篇把排查过程完整记下来。

<!-- more -->

## 一、先纠正一个思维定式

"虚拟机都好好的，只有管理界面挂了"——这个特征特别容易让人往 UI 层猜：`pveproxy`（网页服务）有问题？浏览器缓存？证书？集群文件系统 `pmxcfs` 卡了？

我最初就是这么想的，绕了不少弯路。

正确的第一步其实很朴素：**先看守护进程死没死，而不是先看应用日志。**

## 二、一行命令看到真相

```bash
systemctl status pvestatd
```

输出：

```
× pvestatd.service - PVE Status Daemon
     Loaded: loaded (/lib/systemd/system/pvestatd.service; enabled; preset: enabled)
     Active: failed (Result: signal) since Thu 2026-10-15 18:44:28 CST; 6h ago
     Main PID: 1811 (code=killed, signal=SEGV)
```

再翻历史：

```
Sep 29 20:21:06 pve systemd[1]: pvestatd.service: Main process exited, code=killed, status=11/SEGV
Sep 29 20:21:06 pve systemd[1]: pvestatd.service: Failed with result 'signal'.
Oct 11 17:48:27 pve systemd[1]: pvestatd.service: Main process exited, code=killed, status=11/SEGV
Oct 15 18:44:28 pve systemd[1]: pvestatd.service: Main process exited, code=killed, status=11/SEGV
```

**`pvestatd` 是 PVE 的状态守护进程。** 它周期性采集节点、虚拟机、存储的状态，然后广播给 `pveproxy`——网页上看到的 CPU/内存/磁盘曲线、虚拟机运行状态，全都来自它。

再看这一行，问题就闭环了：

```bash
systemctl show pvestatd -p Restart
# Restart=no
```

**上游给 `pvestatd` 配的是 `Restart=no`。**

所以它一旦段错误（SEGV）崩掉，systemd 不会重新拉起它，它就永久躺平——直到你手动干预。

## 三、所有现象一次性对上

| 现象 | 机制 |
|---|---|
| 网页 UI 假死 | 状态数据源没了，`pveproxy` 拿不到节点/虚拟机状态 |
| **`qm list` 卡住不返回** | 同一套状态路径失效 |
| **虚拟机照常运行** | 死的是监控守护进程，不是 QEMU |
| 重启物理机就好 | 重启把它重新拉起来了 |
| 过段时间又犯 | 它又会崩，且从不自愈 |
| 升级后依然有 | 上游至今仍给它配 `Restart=no` |
| 表现像"随机" | 崩溃时间不可预测，看起来毫无规律 |

### 立刻可用的急救办法

这是整篇最值钱的一句话：

> **下次 UI 卡死、`qm list` 卡住时，你不需要重启物理机。**

```bash
systemctl restart pvestatd
```

网页和 `qm` 立刻恢复，**正在跑的虚拟机毫发无伤**。

我几个月来一直在用"重启整机"这种核弹级手段，去处理一个 `systemctl restart` 就能解决的问题。如果你也在这么干，这篇就没白写。

## 四、为什么它看起来完全随机

因为崩溃本身确实不可预测。历史上出现的时刻：`Sep 04`、`Sep 10`、`Sep 29`、`Oct 11`、`Oct 15`——间隔从几天到两周不等，跨了多次升级和重启。

但**崩溃发生之后的行为是完全确定的**：`Restart=no` → 永久失效 → 界面假死。所以定位的关键不是预测它什么时候崩，而是识别"崩了之后没人管"这个结构性问题。

顺手记一个排查技巧：**时间线是成本最低的因果检验工具。**

日志里还有一个更容易误导人的东西：

```bash
journalctl -g 'status update time' | wc -l
# 1202
journalctl -g 'status update time' | head -3
# May 11 04:40  pvestatd[1116]: status update time (39.153 seconds)
```

一千多条"状态更新耗时 36~40 秒"的警告，看起来像是元凶。但它从 5 月就开始了，而 `pvestatd` 崩溃重启贯穿 5–7 月，两者是**同时存在**而非先后因果。真正能解释"为什么卡住之后要等到重启才恢复"的，是 `Restart=no`。

（这些 36 秒的慢循环我还没查清，见第五节。）

## 五、修复一：让 pvestatd 自己站起来

**不要改 `/lib/systemd/system/pvestatd.service`**，包升级会覆盖。用 drop-in：

```bash
mkdir -p /etc/systemd/system/pvestatd.service.d
cat > /etc/systemd/system/pvestatd.service.d/10-restart-on-failure.conf <<'EOF'
[Unit]
StartLimitIntervalSec=0

[Service]
Restart=on-failure
RestartSec=5
EOF
systemctl daemon-reload
```

### 这里有个把我坑过一次的细节

我第一版把 `StartLimitIntervalSec=0` 写进了 `[Service]` 段。journald 悄悄记了一句：

```
Unknown key 'StartLimitIntervalSec' in section [Service], ignoring.
```

**`StartLimitIntervalSec` 属于 `[Unit]` 段，不是 `[Service]` 段。** 写错会被**静默忽略**——配置文件看起来好好的，实际根本没生效。

验证方法（一定要看 `StartLimitIntervalUSec`）：

```bash
systemctl show pvestatd -p Restart -p RestartUSec -p StartLimitIntervalUSec
# Restart=on-failure
# RestartUSec=5s
# StartLimitIntervalUSec=0      ← 0 才说明频率限制真的解除
```

### 同类服务一起加固

```bash
for svc in pvescheduler spiceproxy; do
  mkdir -p /etc/systemd/system/$svc.service.d
  cat > /etc/systemd/system/$svc.service.d/10-restart-on-failure.conf <<'EOF'
[Unit]
StartLimitIntervalSec=0

[Service]
Restart=on-failure
RestartSec=5
EOF
done
systemctl daemon-reload

for s in pvestatd pvescheduler spiceproxy pveproxy pvedaemon pve-cluster; do
  printf "%-14s Restart=%-12s Active=%s\n" \
    "$s" "$(systemctl show $s -p Restart --value)" "$(systemctl is-active $s)"
done
```

> 顺带一个发现：`pveproxy`、`pvedaemon`、`pve-cluster` **本来就有** `Restart=on-failure`，唯独最该有自愈能力的 `pvestatd` 没有。

## 六、修复二：看门狗兜底 + 记录现场

`Restart=on-failure` 覆盖"运行中崩溃"。但如果它在启动早期就崩、单元被留在 `failed` 状态，还是需要外部兜底。

`/usr/local/bin/pvestatd-watchdog.sh`（`chmod 0755`）：

```bash
#!/bin/bash
# pvestatd 挂了就拉起来，并把现场记录下来
set -u
LOG=/var/log/pvestatd-watchdog.log

if ! systemctl is-active --quiet pvestatd; then
  {
    echo "$(date -Is) pvestatd NOT active (state=$(systemctl is-failed pvestatd)) -> restarting"
    dmesg | grep -i 'pvestatd.*segfault' | tail -3
    journalctl -u pvestatd -n 20 --no-pager
  } >> "$LOG"
  systemctl restart pvestatd >> "$LOG" 2>&1
  echo "$(date -Is) restart issued -> now $(systemctl is-active pvestatd)" >> "$LOG"
fi

# /etc/pve 卡住 = qm 卡住的典型信号
if ! timeout 10 ls /etc/pve/qemu-server/ >/dev/null 2>&1; then
  echo "$(date -Is) pmxcfs /etc/pve unresponsive (>=10s)" >> "$LOG"
fi
```

配套 timer：

```ini
# /etc/systemd/system/pvestatd-watchdog.timer
[Unit]
Description=Run pvestatd watchdog every 2 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min
AccuracySec=10s

[Install]
WantedBy=timers.target
```

```bash
systemctl daemon-reload
systemctl enable --now pvestatd-watchdog.timer
systemctl list-timers pvestatd-watchdog.timer
```

## 七、修复三：抓 core dump（根因还没定位时最重要）

到这一步，UI 不会再假死了。但**"为什么会 SEGV"我还没查清**——所以必须让它下次崩溃时留下证据。

这台机器没装 `systemd-coredump`，而 `/proc/sys/kernel/core_pattern` 是裸的 `core`：会写到崩溃进程的当前工作目录（`pvestatd` 是 `/`），基本等于丢掉。

用一个最小 handler 接管：

```bash
# /usr/local/bin/core-dump-handler.sh   (chmod 0755)
#!/bin/bash
set -u
CRASHDIR=/var/crash
PROG="$4"
CORE="$CRASHDIR/core.$PROG.$1"
mkdir -p "$CRASHDIR"
cat > "$CORE"                      # core 从 stdin 进来
chmod 0640 "$CORE"
echo "time=$(date -Is) pid=$1 signal=$2 exe=$4" > "$CORE.info"
ls -1t "$CRASHDIR"/core.* 2>/dev/null | tail -n +11 | xargs -r rm -f
```

```bash
# /etc/sysctl.d/90-core-dump.conf
kernel.core_pattern=|/usr/local/bin/core-dump-handler.sh %p %s %c %e
```

```bash
sysctl --system
cat /proc/sys/kernel/core_pattern
# |/usr/local/bin/core-dump-handler.sh %p %s %c %e

# 确保 pvestatd 允许 dump
mkdir -p /etc/systemd/system/pvestatd.service.d
cat > /etc/systemd/system/pvestatd.service.d/20-core-dump.conf <<'EOF'
[Service]
LimitCORE=infinity
EOF
systemctl daemon-reload
```

下次崩溃后：

```bash
apt-get install -y gdb
ls -l /var/crash/
gdb /usr/bin/perl /var/crash/core.pvestatd.<pid> -batch -ex 'bt full'
```

## 八、还剩什么没查清

我不想把这篇写成"全部搞定"的爽文。

**`pvestatd` 为什么会 SEGV，我还没定位到。** 已知线索：

- 崩溃地址类似 `ffffffff0001120d`、`error 5`，`ip` 每次落在 perl 二进制不同偏移 → 更像**堆损坏**，而非固定路径的确定性 bug
- 崩溃前 CPU 时间偏高（有一次累计 52 分钟）
- 那 1202 次 `status update time` 警告节律相当规律（约 36s + 8s ≈ 44s 周期），像某个固定阻塞操作
- 我用 `strace` 跟了 55 秒，**当下循环是毫秒级的** → 卡顿是间歇性的，必须在卡住的那一刻抓现场

`pvestatd` 的状态循环里确实存在"可以很慢"的调用：

```perl
update_qemu_status(...)   # → QemuServer::vmstatus(undef, 1)
```

源码注释写得很直白：

```perl
# This must be fast and should not block ($full == false)
# We only query KVM using QMP if $full == true (this can be slow)
```

而 `pvestatd` 恰恰传了 `$full = 1`，会为每台运行中的虚拟机走 QMP 查询。QMP 命令默认超时 5 秒，但部分命令高达 60 秒甚至 1 小时。

所以下一步是**在卡顿发生的那一刻抓现场**，而不是继续猜。配合已经装好的 core dump handler，下次崩溃应该能拿到真正的 `bt full`。

## 九、排查清单（可直接抄）

遇到"UI 假死 / `qm list` 卡住但虚拟机正常"，按这个顺序查：

```bash
# 1. 守护进程死了没？——最常见，也最容易被忽略
systemctl status pvestatd pveproxy pvedaemon
systemctl is-active pvestatd
journalctl -u pvestatd -n 50

# 2. 有没有 SEGV / 被 OOM 杀
dmesg | grep -iE 'segfault|oom|killed process'
journalctl -g 'SEGV'

# 3. 是不是卡在内核 I/O（D 状态，kill -9 无效）
ps -eo pid,stat,wchan:25,cmd | awk '$2 ~ /D/'
grep procs_blocked /proc/stat
uptime                      # 看 wa（iowait）占比

# 4. 集群文件系统是否卡住（qm 卡住的典型信号）
time timeout 10 ls /etc/pve/qemu-server/
time timeout 15 qm list

# 5. 状态循环到底慢在哪
journalctl -u pvestatd -g 'status update time' | tail -20

# 6. 急救（不用重启物理机）
systemctl restart pvestatd
```

## 十、几条结论

1. **"UI 假死"不等于"UI 的问题"。** 先看守护进程状态，再看应用日志。一行 `systemctl status` 就能省下几个月的重启。
2. **`pvestatd` 在 PVE 8.4.21 上仍是 `Restart=no`。** 崩溃即永久失效，且表现为"只有管理界面挂了、业务照跑"，极具迷惑性。建议所有 PVE 用户都加上自愈 drop-in。
3. **症状消失 ≠ 根因解决。** 加了自动重启，UI 不会再假死，但 SEGV 本身还在发生——所以要装 core dump handler 继续追。
4. **`qm list` 卡住时别急着重启整机。** `systemctl restart pvestatd` 几乎总是够用，而且不影响正在运行的虚拟机。
5. **注意 systemd 的静默失效。** `StartLimitIntervalSec` 放错段会被"忽略"而不报错——配置看着在，其实没生效。改完一定要用 `systemctl show` 验证。

---

*环境：PVE 8.4.21 / kernel 6.8.12-43-pve。*
