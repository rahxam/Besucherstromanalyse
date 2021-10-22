// node
const fs = require('fs')
const path = require('path')
// const { v4: uuidv4 } = require('uuid')
/**
 * reads all files in the given directory. they must be JSON
 * @param {*} dirname
 */
/* c8 ignore start */
module.exports.readDirectory = (dirname) => {
  const readDirPr = new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) =>
      err ? reject(err) : resolve(filenames)
    )
  })
  return readDirPr.then((filenames) =>
    Promise.all(
      filenames.map((filename) => {
        return new Promise((resolve, reject) => {
          fs.readFile(
            path.resolve(dirname, filename),
            'utf-8',
            (err, content) =>
              err
                ? reject(err)
                : resolve({
                  data: JSON.parse(content).values,
                  name: filename.slice(0, -5)
                })
          ) // cut off .json in filename
        })
      })
    )
      .then((data) => {
        return data.reduce((accumulator, currentValue) => {
          accumulator[currentValue.name] = currentValue.data
          return accumulator
        }, {})
      })
      .catch((error) => Promise.reject(error))
  )
}

/**
 * deletes everything in a given directory
 * @param {*} dirname
 */

/* c8 ignore start */
module.exports.emptyDirectory = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)
    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + '/' + filename).isDirectory()) {
          module.exports.emptyDirectory(path + '/' + filename)
        } else {
          fs.unlinkSync(path + '/' + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
    fs.mkdirSync(path)
  } else {
    console.log('Directory path not found, create:', path)
    fs.mkdirSync(path)
  }
}
/* c8 ignore end */

module.exports.formatDate = (date) => {
  date = date.replace(/\D/g, '')
  date = parseInt(date)
  if (date > 4103000000000) {
    date = date / 1000
  }
  date = new Date(
    new Date(date).getTime() +
      new Date().getTime() -
      new Date('2020-09-01T00:00:00.000Z').getTime()
  )

  return date.toISOString().substring(0, 10)
}
