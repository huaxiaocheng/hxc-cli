// 获取版本号
const { version } = require('./version/constants')
const path = require('path')
const program = require('commander')

// 配置命令
program
    .command('view')
    .alias('vw')
    .description(['hxc view ./data'])
    .action(() => {
        if(process.argv.slice(3).length === 0) {
            console.log('pelase enter the path')
        } else {
            require(path.resolve(__dirname, 'view/view'))(...process.argv.slice(3))
        }
    })

program.command('punch')
    .alias('pc')
    .description(['set: hxc punch 0855 | get: hxc punch'])
    .action(() => {
        require(path.resolve(__dirname, 'punch/punch'))(...process.argv.slice(3))
    })

program.version(version, '-v, --version').parse(process.argv)