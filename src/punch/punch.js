const fs = require('fs')
const loading = require('loading-cli')
const inquirer = require('inquirer')
const log = require('npmlog')
const excelJs = require('exceljs')

module.exports = async (order) => {
    const today = new Date()
    const month = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)
    const day = today.getDate() > 9 ? today.getDate() : '0' + today.getDate()
    const date = today.getFullYear() + '-' + month + '-' + day

    if (order === undefined) {
        const load = loading('loading...').start()
        let data = await fs.readFileSync('d:/workspace/hxc-cli/data/punchTime.txt')
        load.succeed('load completed!')

        const automatic = data.toString().split('\r\n')[0].replace('T', ' ')
        const manual = data.toString().split('\r\n')[1]
        log.info('punch time - automatic report: ' + (automatic && automatic.substring(0, 10) === date ? automatic : ''))
        log.info('punch time - manual report   : ' + (manual && manual.substring(0, 10) === date ? manual : ''))
    } else if (order === 'saveDataToExcel') {
        // 定时/关机前执行脚本：写入统计excel
        let data = await fs.readFileSync('d:/workspace/hxc-cli/data/punchTime.txt')
        const automatic = data.toString().split('\r\n')[0].replace('T', ' ')
        const manual = data.toString().split('\r\n')[1]

        const workbook = new excelJs.Workbook()
        try {
            await workbook.xlsx.readFile('d:/workspace/hxc-cli/data/punchTime.xlsx')
            const worksheet = workbook.getWorksheet('Sheet1')
            // 取消工作表保护
            worksheet.unprotect()
            let spaceRow = 0
            worksheet.eachRow((row, index) => {
                if (index > 1) {
                    let excelDate = row._cells[0]._value.model.value
                    if (excelDate === date) {
                        spaceRow = index
                        return
                    }
                }
            })
            if (spaceRow === 0) {
                spaceRow = worksheet._rows.length + 1
                worksheet.getCell(`A${spaceRow}`).value = date
            }
            worksheet.getCell(`B${spaceRow}`).value = automatic && automatic.substring(0, 10) === date ? automatic.substring(11, 16) : ''
            worksheet.getCell(`C${spaceRow}`).value = manual && manual.substring(0, 10) === date ? manual.substring(11, 16) : ''
            try {
                await workbook.xlsx.writeFile('d:/workspace/hxc-cli/data/punchTime.xlsx')
            } catch (e) {
                log.error('update excel failed!')
            }
        } catch (e) {
            log.error('load excel failed!')
        }
    } else {
        if (!/^(?:(?:[0-2][0-3])|(?:[0-1][0-9]))[0-5][0-9]$/.test(order)) {
            console.log('time format e.g.: 0855')
        } else {
            const loadRead = loading('loading...').start()
            let data = fs.readFileSync('d:/workspace/hxc-cli/data/punchTime.txt')
            loadRead.succeed('load completed!')

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
                loadWrite.succeed('update completed!')

                log.info('updated punch time: ' + date + ' ' + time)
            }
        }

    }
}