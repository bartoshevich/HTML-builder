const fs = require('fs');
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, '/styles');
const pathToProjectCSS = path.join(__dirname, 'project-dist', 'bundle.css');
const bundle = fs.createWriteStream(pathToProjectCSS);

fs.promises.readdir(pathToProject, 'utf8', { withFileTypes: true }).then((files) => {
  for (let file of files) {

    fs.stat(pathToProject + '/' + file, (err, stats) => {

      if (err) {
        console.error(err)
        return
      }

      if (path.basename(file, path.extname(file)) === 'bundle') {

        fs.truncate(pathToProjectCSS, err => {
          if (err) throw err;
        });

      }
    })
  }
})

function mergeFiles(pathDir) {
  fs.promises.readdir(pathDir, 'utf8', { withFileTypes: true }).then((files) => {
    for (let file of files) {

      fs.stat(pathDir + '/' + file, (err, stats) => {

        if (err) {
          console.error(err)
          return
        }

        if (stats.isFile() && path.extname(file).slice(1) === 'css') {
          let pathToFile = path.join(__dirname, 'styles', file);

          const readableStream = fs.createReadStream(pathToFile, 'utf-8');
          readableStream.on('data', chunk => bundle.write(chunk));

        }
      })
    }
  })
};


try {
  mergeFiles(pathToStyles);
} catch (error) {
  console.log(error.message);
}