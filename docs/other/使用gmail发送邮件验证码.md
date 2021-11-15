# 使用gmail发送邮件验证码

## 注册邮箱

此步不做过多赘述

## 设置二步验证

![2021-08-25-10-26-00-image](https://listener.oss-cn-beijing.aliyuncs.com/blog/2021-08-25-10-26-00-image.png)

## 设置专用密码

如上图，开启两步验证后，会出现`应用专用密码`tab，点击设置专用密码即可

## 项目配置

```env
MAIL_DRIVER = smtp
MAIL_HOST = smtp.qq.com
MAIL_PORT = 587
MAIL_USERNAME = xxx@gmail.com
MAIL_PASSWORD = xxxx
MAIL_ENCRYPTION = tls
```

MAIL_PASSWORD写生成的专用密码

本文参考google文档[使用应用专用密码登录 - Google 帐号帮助](https://support.google.com/accounts/answer/185833?authuser=1)[使用应用专用密码登录 - Google 帐号帮助](https://support.google.com/accounts/answer/185833?authuser=1)

> 本文使用laravel框架，在用ssl协议465端口发送验证码时报错
> 
> Connection could not be established with host smtp.gmail.com :stream_socket_client(): unable to connect to ssl://smtp.gmail.com:465 (Operation timed out)
> 
> 改成tls协议587端口后不再报错
