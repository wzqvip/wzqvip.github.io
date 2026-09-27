---
title: "Linux下通过SSH使用密钥对实现无密码登录"
date: 2024-11-07 23:02:59
categories:
  - "Server"
tags:
  - "Linux"
  - "ssh"
  - "rsa-key"
description: "生成key指南。 以及如果使用keygen生成.pub（SSH2)的话要转换成rsa普通格式"
---

生成key指南。 以及如果使用keygen生成.pub（SSH2)的话要转换成rsa普通格式

<!-- more -->

在客户端生成密钥对（如果已经有，则跳过这一步）：

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

该命令将生成一对密钥，通常存储在 ~/.ssh/ 目录下，生成的文件为 id\_rsa（私钥）和 id\_rsa.pub（公钥）。

将公钥拷贝到服务器： 使用以下命令将生成的公钥文件传输到服务器的目标用户下：

```
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server_ip
```

或者手动将 id\_rsa.pub 的内容追加到服务器用户的 ~/.ssh/authorized\_keys 文件中。可以使用以下命令：

```
cat ~/.ssh/id_rsa.pub | ssh user@server_ip 'cat >> ~/.ssh/authorized_keys'
```

确保服务器的 .ssh/authorized\_keys 文件权限正确： 在服务器上，确保 ~/.ssh 目录及文件权限设置正确，否则SSH会拒绝使用密钥登录。

```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

修改SSH配置文件（可选）： 确保服务器的 /etc/ssh/sshd\_config 文件中启用了 PubkeyAuthentication：

```
PubkeyAuthentication yes
PasswordAuthentication no  # 可选，禁用密码登录
```

修改后重启SSH服务以应用配置：

```
sudo service ssh restart
sudo systemctl restart sshd #或者这个

```

---

如果是用软件生成的key pair的，内容为

```
---- BEGIN SSH2 PUBLIC KEY ----
xx
---- END SSH2 PUBLIC KEY ----
```

需要转换。命令为

```
ssh-keygen -i -f path_to_your_key.pub > ~/.ssh/authorized_keys
```

然后再尝试就可以了
