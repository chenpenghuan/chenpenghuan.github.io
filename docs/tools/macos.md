# macos

## mac自启动设置

以nginx为例

### 1.编辑启动配置文件

sudo vim /Library/LaunchDaemons/com.nginx.plist加入

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>com.nginx.plist</string>
        <key>ProgramArguments</key>
        <array>
                <string>/usr/local/nginx/sbin/nginx</string>
        </array>
        <key>KeepAlive</key>
        <false/>
        <key>RunAtLoad</key>
        <true/>
        <key>StandardErrorPath</key>
        <string>/usr/local/nginx/logs/error.log</string>
        <key>StandardOutPath</key>
        <string>/usr/local/nginx/logs/access.log</string>
</dict>
</plist>
```

### 2.修改权限

sudo chmod 644 /Library/LaunchDaemons/com.nginx.plist

### 3.注册为系统服务

sudo launchctl load -w /Library/LaunchDaemons/com.nginx.plist 

卸载为sudo launchctl unload -w /Library/LaunchDaemons/com.nginx.plist 

## 软件询问是否接入网络的解决办法

对于Mac下程序始终询问是否接入网络问题的解决办法   

1. 关闭程序；   
2. 修改防火墙，把相关程序从防火墙的白名单中删除；  
3. 删除~/Library/Preferences/com.该程序名.plist文件。   
   到次即可，重启程序后会新建相关文件并自动修改防火墙中相关内容，该问题已解决。

## homebrew

```shell
# show a list of all your installed Homebrew packages
brew list
# It will pin the formula to the current version
brew pin <formula>
```

## maven报错 
`The JAVA_HOME environment variable is not defined correctly` 

解决办法：

```shell
# On macOS 10.15 Catalina and later, the default Terminal shell is zsh. For the zsh shell, we can put the environment variables at ~/.zshenv or ~/.zshrc.
export JAVA_HOME=$(/usr/libexec/java_home)
# Before macOS 10.15 Catalina, the default Termina shell is bash. For the bash shell, we can put the environment variables at ~/.bash_profile or ~/.bashrc.
export JAVA_HOME=$(/usr/libexec/java_home)
```

## 飞塔vpn开源替代方案

安装openfortivpn

```shell
brew install openfortivpn
```

编辑config文件`/usr/local/etc/openfortivpn/openfortivpn/config`

```shell
host = xxx
username = xxx
password = xxx
trusted-cert = xxx
```

登录vpn

```shell
sudo openfortivpn
```



