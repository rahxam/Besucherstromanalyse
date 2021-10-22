let dataGenerator = null
module.exports = cds.service.impl(srv => {
  srv.on('reset', async () => {
    // lazy loading
    cds.env.features.assert_integrity = false
    if (!dataGenerator) {
      const DataGenerator = require('./data/DataGenerator')

      dataGenerator = new DataGenerator()
    }
    await cds.connect.to('db')
    await dataGenerator.injectIntoCDS(cds)
    cds.env.features.assert_integrity = true
  })
})
