const { exec } = require('child_process');
function gitPull() {
    exec('git pull && git submodule update', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            throw err;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}
setInterval(gitPull, 10000);
