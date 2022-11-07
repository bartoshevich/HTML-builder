const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log(error.message));


// fs.readFile(
//   path.join(__dirname, 'text.txt'),
//   'utf-8',
//   (err, data) => {
//       if (err) throw err;
//       console.log(data);
//   }
// );


