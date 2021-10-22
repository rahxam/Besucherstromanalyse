module.exports = cds.service.impl((srv) => {
  srv.on('reset', async () => {
    const db = await cds.connect.to('db')
    await db.run(() => require('../init')(db))
  })
})
