// module.exports = require('./data')

const DataGenerator = require('./DataGenerator')
module.exports = new DataGenerator().writeCSV()
