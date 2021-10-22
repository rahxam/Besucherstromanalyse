const expect = require('chai').expect
const Generator = require('./../../../srv/data/DataGenerator')

describe('generator', () => {
  let generator = null
  it('should startup', async () => {
    generator = new Generator()
    await generator.parsing
    expect(generator).to.be.an('object')
  })

  it('mock injectIntoCDS', async () => {
    const cdsStub = {
      operations: [],
      run: async (op) => { if (op) cdsStub.operations.push(...op) }
    }

    await generator.injectIntoCDS(cdsStub)
    await cdsStub.run()

    expect(cdsStub.operations).lengthOf.to.be.greaterThan(1, 'demo data seams to be to short') // at the time of writing it was 2
    console.info(`\treceived ${cdsStub.operations.length} cds operations`)
  })

  it('write CSV', () => {
    return generator.writeCSV()
  })
})
