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

## charles抓包配置

1. 安装charles
2. 电脑上安装证书`help>SSL Proxying>Install Charles root Certificate`
2. 手机上安装证书 `help>SSL Proxying>install charles ...................browser`
2. 设置抓包域名点击proxy>SSL Proxying Settings打开如下弹框，勾选ssl代理开关，左侧inclide为需要抓取的代理，填写需要抓取https的host，port里填写443即可，也可以用*号代替

> ios安装证书和安卓大致不差，只是比安卓多出了一步，在安装下载完证书时，需要认证：设置—>通用—>  关于本机—>证书信任设置，信任该证书后安装便可抓https请求了。
