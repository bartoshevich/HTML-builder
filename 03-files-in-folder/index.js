const fs = require('fs');
const path = require('path');

function readDirectory(pathDir) {
  fs.promises.readdir(pathDir, 'utf8', { withFileTypes: true }).then((files) => {
    for (let file of files) {

      fs.stat(pathDir + '/' + file, (err, stats) => {
        if (err) {
          console.error(err)
          return
        }
        if (stats.isFile()) {
          let name = path.basename(file, path.extname(file));
          let size = stats.size;
          let ext = path.extname(file).slice(1);
          console.log(`${name} - ${ext} - ${size}b`)
        }
      })
    }
  })
};

try {
  readDirectory(path.join(__dirname, '/secret-folder'));
} catch (error) {
  console.log(error.message);
}