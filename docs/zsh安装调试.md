# zsh安装与调试

## 安装

参考zsh官网https://ohmyz.sh/

## 从bash切换到zsh

```shell
chsh -s /bin/zsh
```

## 安装power line

```shell
pip3 install powerline-status --user
```
## 安装PowerLine

```shell
pip install powerline-status --user
```
## 安装PowerFonts

```
# git clone

git clone https://github.com/powerline/fonts.git --depth=1

# cd to folder

cd fonts

# run install shell

./install.sh
```

安装好字体库之后，我们来设置iTerm2的字体，具体的操作是iTerm2 -> Preferences -> Profiles -> Text，在Font区域选中Change Font，然后找到Meslo LG字体。有L、M、S

## 安装配色方案

```
cd ~/Desktop/OpenSource

git clone https://github.com/altercation/solarized

cd solarized/iterm2-colors-solarized/

open .
```
在打开的finder窗口中，双击Solarized Dark.itermcolors和Solarized Light.itermcolors即可安装明暗两种配色

再次进入iTerm2 -> Preferences -> Profiles -> Colors -> Color Presets中根据个人喜好选择这两种配色中的一种即可

## 安装主题

```
cd ~/Desktop/OpenSource

git clone https://github.com/fcamblor/oh-my-zsh-agnoster-fcamblor.git

cd oh-my-zsh-agnoster-fcamblor/

./install
```
完成后，执行命令打开zshrc配置文件，将ZSH_THEME后面的字段改为agnoster。

```
vi ~/.zshrc
```

## 安装高亮插件

```
cd ~/.oh-my-zsh/custom/plugins/

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git

vi ~/.zshrc

```
这时我们再次打开zshrc文件进行编辑。找到plugins，此时plugins中应该已经有了git，我们需要把高亮插件也加上：

```
plugins=(
  git
  zsh-syntax-highlighting
  zsh-autosuggestions
)
```

请务必保证插件顺序，zsh-syntax-highlighting必须在最后一个。

然后在文件的最后一行添加：source ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

## 安装补全插件zsh-autosuggestion

与高亮插件同样的安装方式

## zsh远程登录文件乱码问题解决

在~/.zshrc文件尾部添加

```
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```
