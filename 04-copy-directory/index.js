
const fs = require('fs');
const path = require('path');

const pathToSourceFolder = path.join(__dirname, '/files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

fs.mkdir(pathToCopyFolder, { recursive: true }, err => {
  if (err) throw err;
});


function clearDirectory(pathDir) {
  fs.promises.readdir(pathDir, 'utf8', { withFileTypes: true }).then((files) => {
    for (let file of files) {

      let pathToFile = path.join(pathDir, file);

      fs.unlink(pathToFile, err => {
        if (err) throw err;
      });

    }
  })
};


function copyDirectory(pathDir) {
  fs.promises.readdir(pathDir, 'utf8', { withFileTypes: true }).then((files) => {
    for (let file of files) {

      let pathToSource = path.join(pathDir, file);
      let pathToDestination = path.join(__dirname, 'files-copy', file);

      fs.copyFile(pathToSource, pathToDestination, (err) => {
        if (err) throw err;
      });

    }
  })
};


try {
  clearDirectory(pathToCopyFolder);
  copyDirectory(pathToSourceFolder);
} catch (error) {
  console.log(error.message);
} 