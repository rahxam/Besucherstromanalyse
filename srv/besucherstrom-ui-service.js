const cds = require('@sap/cds')
module.exports = async function () {
  this.after('READ', 'EntrancesHistoryStatusFull', readEntrancesHistoryStatusFull)
  this.on('READ', 'EntrancesHistoryStatus', readEntrancesHistoryStatus)

  async function readEntrancesHistoryStatusFull (value) {
    value = value.map(x => {
      x.color = 'green'
      if (x.value > 0.8) {
        x.color = 'orange'
      }
      if (x.value > 1.1) {
        x.color = 'red'
      }
      return x
    })
  }

  async function readEntrancesHistoryStatus (req) {
    let value = await cds.run(req.query)

    const agg = value.length / 8

    const values = []
    let x = 0
    let y = agg
    let aggValue = Object.assign({}, value[0])
    aggValue.waitingPeople = 0
    value.forEach(element => {
      x++
      aggValue.waitingPeople += element.waitingPeople
      if (x > y) {
        y = y + agg
        values.push(aggValue)
        aggValue = element
      }
    })
    values.push(aggValue)

    value = values.map(x => {
      x.color = 'green'
      if (x.value > 0.8) {
        x.color = 'orange'
      }
      if (x.value > 1.1) {
        x.color = 'red'
      }
      return x
    })

    return value
  }
}
