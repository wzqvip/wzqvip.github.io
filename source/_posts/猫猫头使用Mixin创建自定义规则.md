---
title: "猫猫头使用Mixin创建自定义规则"
date: 2024-09-19 22:28:00
categories:
  - "Network"
tags:
  - "CFW"
description: "魔导书是从大魔导师那里订阅的，虽然已经有分流，但是有些内网站点也被魔法劫持了。这时候需要添加一些个性化内容，比如对于部分站台不使用魔法。直接修改yaml的话，更新配置文件后这个改动就会被覆盖。 我们可以通过猫猫头的Mixin功能添加个性化的…"
---

魔导书是从大魔导师那里订阅的，虽然已经有分流，但是有些内网站点也被魔法劫持了。这时候需要添加一些个性化内容，比如对于部分站台不使用魔法。直接修改yaml的话，更新配置文件后这个改动就会被覆盖。
我们可以通过猫猫头的Mixin功能添加个性化的配置，对于所有魔法吟唱都作用。

<!-- more -->

之前是手动编辑yaml，但是更新订阅就会被覆盖。看到Mixin下面写的是 "allow you to overwrite the original configuration rule". 于是探讨下这个。

以下为ChatGPT o1-preview的解析： (已修改）

您好，*Clash for Clans* 的 mixin 功能允许您在不修改原始配置文件的情况下覆盖或添加额外的配置。这对于您想要指定某些域名和 IP 网段不走代理、直接连接的需求非常适合。

您可以使用 mixin 来添加自定义的规则，将特定的域名和 IP 网段设为直连。以下是如何操作的示例：

```
mixin:
  rules:
    - DOMAIN-SUFFIX,example.com,DIRECT
    - DOMAIN,www.specificdomain.com,DIRECT
    - IP-CIDR,192.168.0.0/16,DIRECT
    - IP-CIDR,10.0.0.0/8,DIRECT
```

在上述示例中：

DOMAIN-SUFFIX,example.com,DIRECT：所有以 example.com 结尾的域名将直接连接。
DOMAIN,www.specificdomain.com,DIRECT：特定的域名 www.specificdomain.com 将直接连接。
IP-CIDR,192.168.0.0/16,DIRECT 和 IP-CIDR,10.0.0.0/8,DIRECT：指定的 IP 网段将直接连接。
注意事项：

规则顺序：Clash 的规则是按顺序匹配的，建议将自定义的直连规则放在规则列表的顶部，以确保优先匹配。您可以在 mixin 中使用 RuleProviders 或调整规则顺序。

```
mixin:
  rules:
    - RULE-SET,local,DIRECT
    - ...（其他规则）
```

保存配置：在修改完配置后，记得保存并重新加载 Clash 配置，以使新规则生效。

---

说得好，我们来测试一下。

```
mixin:
  rules:
    - DOMAIN-SUFFIX,edu.cn,DIRECT
    - IP-CIDR,10.0.0.0/8,DIRECT

```

这里对于*edu.cn*后缀和*10.X.X.X*都使用直连，测试没有问题。
