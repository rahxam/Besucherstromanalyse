const cds = require('@sap/cds')
const { v4: uuid } = require('uuid')
const { uniqueNamesGenerator, names } = require('unique-names-generator')

module.exports = async function () {
  const EchtEventService = await cds.connect.to('EchtEventService')
  const config = {
    dictionaries: [names]
  }

  this.on('READ', 'Books', readBooks)

  async function readBooks (req) {
    const books = await SELECT.from('Books')
    const book = books[Math.floor(Math.random() * books.length)]

    await UPDATE('Books').with({ name: uniqueNamesGenerator(config) }).where({ ID: book.ID })
    await INSERT.into('Books').entries([{ ID: uuid(), name: uniqueNamesGenerator(config) }])

    EchtEventService.emit('fancyEvent', {})

    return await SELECT.from('Books')
  }
}
