module.exports = async function () {
  this.on('READ', 'Genre', readGenre)

  async function readGenre (req) {
    return [
      {
        ID: 'a6f7a098-d63c-4359-a67d-94515d296252',
        name: 'Belleristik'
      }
    ]
  }
}
