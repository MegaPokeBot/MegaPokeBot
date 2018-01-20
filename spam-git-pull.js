const { exec } = require('child_process');
function gitPull() {
    exec('git pull && git submodule update', (err, stdout, stderr) => {
        if (err) {
            // Quit if a current pull is already active
            return;
        }
    });
}
setInterval(gitPull, 10000);
