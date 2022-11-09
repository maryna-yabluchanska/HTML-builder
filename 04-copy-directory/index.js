const fs = require('fs');
const fsPromises = fs.promises;
let path = require('path');

(function copyDir() {
  return fsPromises.mkdir((path.join(__dirname, 'files-copy')), {recursive: true})
    .then(() => {
        fsPromises.readdir(path.join(__dirname, 'files'), {withFileTypes: true})
          .then((result) => {
              let oldFolderNames = [];
              result.forEach(
                (file) => {
                  if (file.isFile()) {
                    oldFolderNames.push(file.name);
                    fsPromises.copyFile(path.join(__dirname, 'files/' + file.name), path.join(__dirname, 'files-copy/' + file.name));
                  }
                }
              )
              return oldFolderNames;
            }
          )
          .then((oldFolder) => {
            fsPromises.readdir(path.join(__dirname, 'files-copy')).then((newFolder) => {
              newFolder.map((fileName) => {
                if (!oldFolder.includes(fileName)) {
                  fs.unlink((path.join(__dirname, 'files-copy/' + fileName)), () => {
                    console.log('File successfully deleted ' + fileName);
                  });
                }
              })
            });
          })
      }
    )
}());
