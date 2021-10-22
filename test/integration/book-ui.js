/* global server, before, beforeEach, util */

const { expect } = require('chai')

// eslint-disable-next-line no-unused-vars
const { GET, POST, PATCH, DELETE } = server.httpOperations()
const service = 'books-ui'
describe(service, () => {
  before(function () { return server.connect(this, '/' + service) })
  beforeEach(() => { return server.reset() })

  util.testEntitySetRead(['Books'])

  it('should not allow to delete Books', async () => {
    const res = await DELETE('/Books(604a1713-eb2d-4c29-bf6b-9325fa98003b)', {
      name: 'Updated Book'
    })
    expect(res).to.have.status(500)
  })

  it('create a new Book', async () => {
    const body = {
      name: 'Boring New Book'
    }
    const res = await POST('/Books', body)
    expect(res).to.have.status(201)
    expect(res.body).to.contain.keys(['ID', 'name'])
    expect(res.body).to.containSubset(body)

    const resGet = await GET(`/Books(${res.body.ID})`)
    expect(res).to.have.status(201)
    expect(resGet.body).to.containSubset(body)
  })

  it('should request Authors', async () => {
    const res = await GET('/Authors')
    expect(res).to.have.status(200)
    expect(res.body.value).to.have.lengthOf(1)
    expect(res.body.value).to.containSubset([{
      ID: '6548751e-b81b-44a6-b4a2-e6bf0ef79702',
      name: 'Nice Author'
    }])
  })
})
