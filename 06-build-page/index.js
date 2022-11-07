const fs = require('fs');
const {createReadStream, createWriteStream, constants } = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises')

// const pathToArticle = path.join(__dirname, 'components', 'articles.html');
// const pathToFooter = path.join(__dirname, 'components', 'footer.html');
// const pathToHeader = path.join(__dirname, 'components', 'header.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToSourceStyles = path.join(__dirname, 'styles');
const pathToProjectFolder = path.join(__dirname, 'project-dist');
const pathToSourceAssets = path.join(__dirname, 'assets');
const pathToProjectAssets = path.join(__dirname, 'project-dist', 'assets');
const pathToIndex = path.join(__dirname, 'project-dist', 'index.html');
const styles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));



fs.mkdir(pathToProjectFolder, { recursive: true }, err => {
  if (err) throw err;
});

fs.mkdir(pathToProjectAssets, { recursive: true }, err => {
  if (err) throw err;
});


fs.readFile(
  pathToTemplate,
  'utf-8',
  (err, data) => {
    if (err) throw err;

    fs.promises.readdir(pathToComponents, 'utf8', { withFileTypes: true }).then((components) => {
      for (let component of components) {
        const pathToComponent = path.join(__dirname, 'components', component);

        fs.readFile(pathToComponent, 'utf8', (error, content) => {
          if (error) throw error;
          const componentName = path.basename(component, path.extname(component));
          data = data.replace(`{{${componentName}}}`, content);
          fs.writeFile(pathToIndex, data, (err) => {
            if (err) console.log(err);
          });
        });
      }
    })

    // fs.readFile(pathToArticle, 'utf8', (error, article) => {
    //   if (error) throw error;
    //   data = data.replace(/\{\{articles\}\}/, article);
    //   fs.writeFile(pathToIndex, data, (err) => {
    //     if (err)
    //       console.log(err);
    //   });
    // });

    // fs.readFile(pathToHeader, 'utf8', (error, header) => {
    //   if (error) throw error;
    //   data = data.replace(/\{\{header\}\}/, header);

    //   fs.writeFile(pathToIndex, data, (err) => {
    //     if (err)
    //       console.log(err);
    //   });
    // });

    // fs.readFile(pathToFooter, 'utf8', (error, footer) => {
    //   if (error) throw error;
    //   data = data.replace(/\{\{footer\}\}/, footer);

    //   fs.writeFile(pathToIndex, data, (err) => {
    //     if (err)
    //       console.log(err);
    //   });
    // });

  }
);

try {
  mergeStyles(pathToSourceStyles);
  // copyFiles(pathToSourceAssets);
} catch (error) {
  console.log(error.message);
}


function mergeStyles(pathDir) {
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
          readableStream.on('data', chunk => styles.write(chunk));

        }
      })
    }
  })
};





async function copyAssets(pathToSourceAssets) {
  const assets = await fs.promises.readdir(pathToSourceAssets, 'utf8');
  for await (const item of assets) {
    fs.stat(pathToSourceAssets + '/' + item, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {

        fs.mkdir(path.join(pathToProjectAssets, item), { recursive: true }, err => {
          if (err) throw err;
        });

        copyAssets(path.join(pathToSourceAssets, item))
        
      } else {
        let source = path.join(pathToSourceAssets, item);
        let destination = path.join(pathToProjectAssets, path.basename(path.dirname(source)), item);
        let destinationFolder = path.join(pathToProjectAssets, path.basename(path.dirname(source)));

        fs.mkdir(destinationFolder, { recursive: true }, err => {
          if (err) throw err;
        });

        let readStream = fs.createReadStream(source);
        let writeStream = fs.createWriteStream(destination);
        pipeline(readStream, writeStream);
      }
    })
  }
}
copyAssets(pathToSourceAssets)

// 

// function copyFiles(pathDir) {
//   fs.promises.readdir(pathDir, 'utf8', { withFileTypes: true }).then((files) => {
//     for (let item of files) {
//       fs.stat(pathDir + '/' + item, (err, stats) => {
//         if (err) throw err;
//         if (stats.isDirectory()) {

//           fs.mkdir(path.join(pathToProjectAssets, item), { recursive: true }, err => {
//             if (err) throw err;
//           });

//           copyFiles(path.join(pathDir, item))

//         } else {
//           let pathToSource = path.join(pathDir, item);

//           fs.mkdir(path.join(pathToProjectAssets, path.basename(path.dirname(pathToSource))), { recursive: true }, err => {
//             if (err) throw err;
//           });

//           let pathToDestination = path.join(pathToProjectAssets, path.basename(path.dirname(pathToSource)), item);

//           fs.copyFile(pathToSource, pathToDestination, (err) => {
//             if (err) throw err;
//           });

//         }
//       })
//     }
//   })
// }




