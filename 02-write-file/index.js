const fs = require('fs');

let writeStream = fs.createWriteStream('text.txt');
const {stdin, stdout} = process;
const exitNotification = () => {
  stdout.write('До свидания!');
  process.exit();
}

stdout.write('Пожалуйста, введите текст\n')

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    exitNotification()
  }
  writeStream.write(data)
});

process.on('SIGINT', exitNotification);
