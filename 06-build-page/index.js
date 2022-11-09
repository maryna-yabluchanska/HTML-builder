const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises;

function remove() {
  fs.rmdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
    copyAssets();
    copyCss();
    copyHtml();
  });
}

remove();

function copyAssets() {
  return fsPromises.mkdir(path.join(__dirname, 'project-dist/assets'), {recursive: true})
    .then(() => {
        fsPromises.readdir(path.join(__dirname, 'assets'), {withFileTypes: true})
          .then((result) => {
              result.forEach(
                (folder) => {
                  fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/' + folder.name), {recursive: true})
                    .then(() => {
                      fsPromises.readdir(path.join(__dirname, 'assets/' + folder.name), {withFileTypes: true})
                        .then((files) => {
                            files.forEach(
                              (file) => {
                                if (file.isFile()) {
                                  fsPromises.copyFile(path.join(__dirname, 'assets/' + folder.name + '/' + file.name), path.join(__dirname, 'project-dist/assets/' + folder.name + '/' + file.name));
                                }
                              }
                            )
                          }
                        )
                    })
                }
              )
            }
          )
      }
    )
}

function copyCss() {
  const filePath = path.join(__dirname, 'project-dist', 'styles.css')
  const fileStyles = path.join(__dirname, 'styles')

  return fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
    fs.readdir(fileStyles, 'utf-8', (err, content) => {
      content.forEach(file => {
        if (path.extname(file) === '.css') {
          fs.readFile(`${fileStyles}/${file}`, 'utf-8', (err, code) => {
            if (err) throw err
            fs.appendFile(filePath, code, (err) => {
              if (err) throw err
            })
          })
        }
      })
    })
  })
}

function copyHtml() {
  const filePath = path.join(__dirname, 'template.html')
  const fileIndex = path.join(__dirname, 'project-dist/template.html')

  fsPromises.copyFile(filePath, fileIndex)
    .then(() => {
      fs.readFile(fileIndex, 'utf-8', (err, code) => {
        let htmlContent = code;
        const reg = /(?<=\{\{).*?(?=\}\})/g;
        const components = code.match(reg);
        components.forEach((component) => {
          fs.readFile(path.join(__dirname, 'components/' + component + '.html'), 'utf-8', (err, code) => {
            if (!code) {
              return
            }
            htmlContent = htmlContent.replace('{{' + component + '}}', code)
            fs.writeFile(fileIndex, htmlContent, (err) => {
              if (err) throw err
            })
          })
        })
      })
    })
}