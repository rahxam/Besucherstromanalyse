module.exports = async function () {
  this.after('READ', 'EntrancesHistoryStatus', readEntrancesHistoryStatus)

  async function readEntrancesHistoryStatus (value) {
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
}
