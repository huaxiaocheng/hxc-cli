#! /bin/bash
# WIN+R打开命令窗口输入shell:startup，将文件放入
lastRecord=`head -n +1 d:/workspace/hxc-cli/data/punchTime.txt`
lastDate=${lastRecord: 0: 10}

today=`date +"%Y-%m-%d"`

# 只有当天第一次开机执行
if [ "$lastDate" != "$today" ];then

# 打卡到开机大约2分钟
timeEstimatePunch=`date -d "-2 minute" +"%Y-%m-%dT%H:%M"`
sed -i '1d' d:/workspace/hxc-cli/data/punchTime.txt
sed -i '1i '$timeEstimatePunch'\r' d:/workspace/hxc-cli/data/punchTime.txt

fi