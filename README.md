# hxc-cli
个人脚手架项目，完成一些自己使用或者练习的功能，有时间会不断完善。

### 使用模块
* **commander** : 参数解析
* **inquirer** : 命令行交互（选择、确认等）
* **loading-cli** : 命令行加载
* **npmlog** : 命令行日志

### 实现功能
```
Options:
  -v, --version   output the version number
  -h, --help      display help for command

Commands:
  view|vw         hxc-cli view ./data
  punch|pc        set: punch 0855 | get: punch
  help [command]  display help for command
```
* **view|vw** : 查看目录下的文件，选择文件查看文件内容（目前支持.json和.txt）
* **punch|pc** : 手动录入打卡时间，开机自动运行shell脚本自动上报打卡时间，查看打卡时间

### 安装依赖
```
$ npm install
```

### 本地运行
```
$ npm link
```
