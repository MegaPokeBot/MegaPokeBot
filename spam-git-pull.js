const { exec } = require('child_process');
function gitPull() {
    exec('git pull', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            throw err;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}
setTimeout(gitPull, 1000 * 60 * 5); // Too lazy to do the math
