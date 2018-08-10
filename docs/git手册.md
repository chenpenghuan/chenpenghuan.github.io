# git手册

1. 暂存   
    git stash save {暂存说明}   
    git stash list 查看所有暂存    
    git stash apply {暂存名}    应用暂存    
2. 撤销   
    git reset —mixed：此为默认方式，不带任何参数的git reset，即时这种方式，它回退到某个版本，只保留源码，回退commit和index信息   
    git reset —soft：回退到某个版本，只回退了commit的信息，不会恢复到index file一级。如果还要提交，直接commit即可   
    git reset  —hard：彻底回退到某个版本，本地的源码也会变为上一个版本的内容，慎用！   
3. 对比本地和远程的日志   
    git log {branch} ^origin/{branch}        查看未推送的提交   
    git log origin/{branch}                  查看远程日志   
    git log {branch}                                      
4. 拉取远程分支到本地   
    git checkout -b {branchname} origin/{branchname}
5. 查看指定分支日志   
    git  show {commitid}    
6. 查看某个文件的版本历史   
    git log -p {filename}
7. 打tag   
    git tag -a {tagname} -m {message} {commitid}对某次提交打tag    
    git tag                                     查看所有标签   
    git show {tagname}                          查看标签信息   
8. 描述   
    git branch —edit-description {branchname}
9. 删除远程分支   
    git branch -d {branchname} 删除本地分支   
    git push origin —delete {branchname}
