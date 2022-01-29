// 获取版本号
const { version } = require('./constants')
const path = require('path')
const program = require('commander')

// 配置命令
program
    .command('view')
    .alias('vw')
    .description(['hxc-cli view ./data'])
    .action(() => {
        if(process.argv.slice(3).length === 0) {
            console.log('pelase enter the path')
        } else {
            require(path.resolve(__dirname, 'view'))(...process.argv.slice(3))
        }
    })

program.command('punch')
    .alias('pc')
    .description(['set: punch 0855 | get: punch'])
    .action(() => {
        require(path.resolve(__dirname, 'punch'))(...process.argv.slice(3))
    })

program.version(version, '-v, --version').parse(process.argv)