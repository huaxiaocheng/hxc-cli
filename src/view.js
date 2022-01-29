const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

module.exports = async (pathName) => {
    fs.readdir(pathName, function(err, files){
        let dirs = [];
        (async function iterator(i){
            if(i == files.length) {
                const { repo } = await inquirer.prompt({
                    name: 'repo',
                    type: 'list',
                    message: 'please choose a file',
                    choices: dirs
                })
                let data = fs.readFileSync(pathName + '/' + repo)
                if (repo.split('.')[1] === 'json') {
                    console.log(JSON.parse(data))
                } else if (repo.split('.')[1] === 'txt') {
                    console.log( data.toString())
                }
                return ;
            }
            fs.stat(path.join(pathName, files[i]), function(err, data){
                if(data.isFile()){
                    dirs.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    })
}