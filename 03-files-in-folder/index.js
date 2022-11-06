const fs = require('fs')
const fsPromises = fs.promises;
let path = require('path');

function getFileInfo(file) {
  return fsPromises.stat((path.join(__dirname, 'secret-folder/')) + file.name)
    .then(({size}) => {
      if (file.isFile()) {
        const fileInfo = {};
        fileInfo.name = file.name.split('.').slice(0, -1).join();
        fileInfo.ext = path.extname(file.name).slice(1);
        fileInfo.size = (((size / 1024)).toFixed(3) + 'kb');
        console.log(fileInfo.name + ' - ' + fileInfo.ext + ' - ' + fileInfo.size);
      }
    });
}

fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then((results) => {
  results.forEach((file) => {
    getFileInfo(file)
  });
});