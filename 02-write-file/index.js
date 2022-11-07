const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text2.txt'));


stdout.write('Hi! Please name the best thing that happened to you this week\n');

stdin.on('data', data =>  {
  let chunk = data.toString().trim();
 
  if (chunk === 'exit') {   
    process.exit();
  } else {
    output.write(data);
  }

});

process.on('SIGINT', () =>  process.exit());

process.on('exit', () => stdout.write('\nAll the best!\n'));





