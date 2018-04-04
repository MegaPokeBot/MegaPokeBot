const { exec } = require('child_process')

function spawnMainProcess () {
  return new Promise((resolve, reject) => {
    exec('node index.js', (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  })
}
exec('node spam-git-pull.js')

function mainCycle () {
  spawnMainProcess().catch(error => {
    console.log(error)
  }).then(() => mainCycle())
}

mainCycle()
