const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'project-dist', 'bundle.css')
const fileStyles = path.join(__dirname, 'styles')


fs.readdir(fileStyles, 'utf-8', (err, content) => {
  content.forEach(file => {
    if(path.extname(file) === '.css'){
      fs.readFile(`${fileStyles}/${file}`, 'utf-8', (err, code) => {
        if(err) throw err
        fs.appendFile(filePath, code, (err) => {
          if(err) throw err
        })
      })
    }
  })
})