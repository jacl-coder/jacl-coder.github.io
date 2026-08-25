---
title: Linux-windows双系统时间不一致
date: 2024-04-15 19:35:40
tags: [杂项]
mathjax: true
categories: Linux
---
* 问题：

Linux和windows双系统安装完成后，两个系统显示时间相差八个小时。

* 基础知识：

UTC（Universal Time Coordinated）即协调世界时，以原子时长为基础，精度好。

RTC（Real-Time Clock）实时时钟，在计算机领域称为硬件时钟，顾名思义电脑上有个硬件保存了时间信息。让我们下次启动之后，时间还可以正常显示。

* 原因：

windows把RTC时间当作本地时间——在中国，就是东八区时间。而Linux会将RTC时间当作UTC时间。

所以：Linux会将RTC设置成UTC时间。显示时间会根据时区显示，例如在中国，显示时间时会自动+8小时。

Linux关机，启动windows后。Window把RTC当成了本时区的时间，直接显示。但是RTC已经被Linux设置成了UTC时间，所以显示时间会晚8个小时。

* 解决办法：

修改windows，让其将RTC硬件时间当作UTC时间。因为Linux使用RTC时间可能会导致一些程序发生错误。

以管理员身份打开 「PowerShell」，输入以下命令：
```Reg add HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /tREG_DWORD /d 1```


或者打开```注册表编辑器```，定位到计算机```\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInfor
mation``` 目录下，新建一个 ```DWORD``` 类型，名称为 ```RealTimeIsUniversal``` 的键，并修改键值为 ```1``` 即可。
