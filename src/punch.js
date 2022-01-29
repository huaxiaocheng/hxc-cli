const fs = require('fs')
const loading = require('loading-cli')
const inquirer = require('inquirer')
const log = require('npmlog')

module.exports = async (order) => {
    const today = new Date()
    const date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate()

    if (order === undefined) {
        const load = loading('loading...').start()
        let data = await fs.readFileSync('d:/workspace/hxc-cli/data/punchTime.txt')
        load.succeed('loading completed!')

        const automatic = data.toString().split('\r\n')[0].replace('T', ' ')
        const manual = data.toString().split('\r\n')[1]
        log.info('punch time - automatic report: ' + (automatic && automatic.substring(0, 10) === date ? automatic : ''))
        log.info('punch time - manual report   : ' + (manual && manual.substring(0, 10) === date ? manual : ''))

    } else {
        if (!/^(?:(?:[0-2][0-3])|(?:[0-1][0-9]))[0-5][0-9]$/.test(order)) {
            console.log('time format e.g.: 0855')
        } else {
            const loadRead = loading('loading...').start()
            let data = fs.readFileSync('d:/workspace/hxc-cli/data/punchTime.txt')
            loadRead.succeed('loading completed!')

            const time =  order.substring(0, 2) + ':' + order.substring(2, 4)

            let isUpdate = false
            const manual = data.toString().split('\r\n')[1]
            if (manual && manual.substring(0, 10) === date) {
                log.info('last manual reported punch time: ' + manual)

                const { repo } = await inquirer.prompt({
                    name: 'repo',
                    type: 'confirm',
                    message: 'update or not?',
                    default: false
                })
                if (repo) {
                    isUpdate = true
                } else {
                    log.info('update canceled')
                }
            } else {
                isUpdate = true
            }

            if (isUpdate) {
                const loadWrite = loading('updating...').start()

                let newTxt = data.toString().split('\r\n')
                newTxt[1] = date + ' ' + time
                newTxt = newTxt.join('\r\n')
                fs.writeFileSync('d:/workspace/hxc-cli/data/punchTime.txt', newTxt, 'utf8')
                loadWrite.succeed('updating completed!')

                log.info('updated punch time: ' + date + ' ' + time)
            }
        }

    }
}