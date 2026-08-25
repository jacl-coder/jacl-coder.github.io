---
title: Systemd 一些常用命令
date: 2023-11-03 11:17:10
tags: [Linux]
mathjax: true
categories: Linux
---
## 一、Systemd 概述
__Systemd__ 是 Linux 系统工具，用来启动[守护进程](https://www.ruanyifeng.com/blog/2016/02/linux-daemon.html)，已成为大多数发行版的标准配置。根据 Linux 惯例，字母d是守护进程（daemon）的缩写。Systemd 这个名字的含义，就是它要守护整个系统。

```systemctl --version```  
上面的命令可以查看你的 Systemd 的版本。

__Systemd__ 的优点是功能强大，使用方便，缺点是体系庞大，非常复杂。事实上，现在还有很多人反对使用 Systemd，理由就是它过于复杂，与操作系统的其他部分强耦合，违反 $keep$ $simple$, $keep$ $stupid$ 的 [Unix](https://www.ruanyifeng.com/blog/2009/06/unix_philosophy.html)哲学。

<!-- ![Alt text](image.png) -->
<!-- （上图为 Systemd 架构图） -->

## 二、常用命令
对于那些支持 ```Systemd``` 的软件，安装的时候，会自动在```/usr/lib/systemd/system```目录添加一个配置文件。  

而不支持 Systemd 的软件，如 ```Nginx```, ```Alist```...（以```Alist```为例）则需要手动编辑或创建 ```/usr/lib/systemd/system/alist.service```并添加如下内容，其中 ```path_alist``` 为 ```AList``` 所在的路径
```shell
[Unit]
Description=alist                        //名称
After=network.target                     //在什么之后启动
 
[Service]
Type=simple                              //启动类型
WorkingDirectory=path_alist              
ExecStart=path_alist/alist server        //启动进程时执行的命令 
Restart=on-failure
 
[Install]
WantedBy=multi-user.target
```


然后，执行 ```systemctl daemon-reload``` 重载配置，现在你可以使用这些命令来管理程序:  
启动: ```systemctl start alist```  
关闭: ```systemctl stop alist```  
配置开机自启: ```systemctl enable alist```  
取消开机自启: ```systemctl disable alist```  
状态: ```systemctl status alist```  
重启: ```systemctl restart alist```  


## 三、读懂配置文件
配置文件主要放在 ```/usr/lib/systemd/system``` 目录，也可能在 ```/etc/systemd/system``` 目录。找到配置文件以后，使用 ```vim``` 打开即可。

命令可以用来查看配置文件，下面以 ```sshd.service``` 文件为例，它的作用是启动一个 ```SSH``` 服务器，供其他用户以 ```SSH``` 方式登录.

```shell
[root@jacl system]# systemctl cat sshd.service
# /usr/lib/systemd/system/sshd.service

[Unit]
Description=OpenSSH server daemon                              //当前服务的简单描述                          
Documentation=man:sshd(8) man:sshd_config(5)                   //文档位置
After=network.target sshd-keygen.target                        
Wants=sshd-keygen.target

[Service]
Type=notify
EnvironmentFile=-/etc/crypto-policies/back-ends/opensshserver.config
EnvironmentFile=-/etc/sysconfig/sshd
ExecStart=/usr/sbin/sshd -D $OPTIONS $CRYPTO_POLICY
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target
```
可以看到，配置文件分成几个区块，每个区块包含若干条键值对。

下面依次解释每个区块的内容。

## 四、[Unit] 区块：启动顺序与依赖关系
> **After**字段：表示如果```network.target```或```sshd-keygen.service```需要启动，那么```sshd.service```应该在它们之后启动。

相应地，还有一个```Before```字段，定义```sshd.service```应该在哪些服务之前启动。

注意，```After```和```Before```字段只涉及启动顺序，不涉及依赖关系。

举例来说，某 **Web** 应用需要 **postgresql** 数据库储存数据。在配置文件中，它只定义要在 **postgresql** 之后启动，而没有定义依赖 **postgresql** 。上线后，由于某种原因，**postgresql** 需要重新启动，在停止服务期间，该 **Web** 应用就会无法建立数据库连接。

设置依赖关系，需要使用```Wants```字段和```Requires```字段。

> **Wants**字段：表示```sshd.service```与```sshd-keygen.service```之间存在"弱依赖"关系，即如果```sshd-keygen.service```启动失败或停止运行，不影响```sshd.service```继续执行。

> **Requires**字段则表示"强依赖"关系，即如果该服务启动失败或异常退出，那么```sshd.service```也必须退出。

## 五、Service] 区块：启动行为
> **Service**区块定义如何启动当前服务。

#### 启动命令
许多软件都有自己的环境参数文件，该文件可以用```EnvironmentFile```字段读取。

> **EnvironmentFile**字段：指定当前服务的环境参数文件。该文件内部的key=value键值对，可以用key的形式，在当前配置文件中获取。

上面的例子中，**sshd** 的环境参数文件是```/etc/sysconfig/sshd```。

配置文件里面最重要的字段是**ExecStart**。

> **ExecStart**字段：定义启动进程时执行的命令。

上面的例子中，启动```sshd```，执行的命令是```/usr/sbin/sshd -D $OPTIONS```，其中的变量```$OPTIONS```就来自```EnvironmentFile```字段指定的环境参数文件。

与之作用相似的，还有如下这些字段。
```shell
ExecReload字段：重启服务时执行的命令
ExecStop字段：停止服务时执行的命令
ExecStartPre字段：启动服务之前执行的命令
ExecStartPost字段：启动服务之后执行的命令
ExecStopPost字段：停止服务之后执行的命令
```

#### 启动类型
**Type**字段定义启动类型。它可以设置的值如下。
```shell
simple（默认值）：ExecStart字段启动的进程为主进程
forking：ExecStart字段将以fork()方式启动，此时父进程将会退出，子进程将成为主进程
oneshot：类似于simple，但只执行一次，Systemd 会等它执行完，才启动其他服务
dbus：类似于simple，但会等待 D-Bus 信号后启动
notify：类似于simple，启动结束后会发出通知信号，然后 Systemd 再启动其他服务
idle：类似于simple，但是要等到其他任务都执行完，才会启动该服务。一种使用场合是为让该服务的输出，不与其他服务的输出相混合
```
下面是一个**oneshot**的例子，笔记本电脑启动时，要把触摸板关掉，配置文件可以这样写。
```shell
[Unit]
Description=Switch-off Touchpad

[Service]
Type=oneshot
ExecStart=/usr/bin/touchpad-off

[Install]
WantedBy=multi-user.target
```
上面的配置文件，启动类型设为**oneshot**，就表明这个服务只要运行一次就够了，不需要长期运行。

如果关闭以后，将来某个时候还想打开，配置文件修改如下。
```shell
[Unit]
Description=Switch-off Touchpad

[Service]
Type=oneshot
ExecStart=/usr/bin/touchpad-off start
ExecStop=/usr/bin/touchpad-off stop
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```
上面配置文件中，**RemainAfterExit**字段设为**yes**，表示进程退出以后，服务仍然保持执行。这样的话，一旦使用**systemctl stop**命令停止服务，**ExecStop**指定的命令就会执行，从而重新开启触摸板。

#### 重启行为

