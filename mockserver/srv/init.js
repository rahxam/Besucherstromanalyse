module.exports = (db) => {
  const { Authors } = db.entities(
    'API_AUTHORS'
  )
  return cds.run([
    INSERT.into(Authors).entries([
      {
        ID: '6548751e-b81b-44a6-b4a2-e6bf0ef79702',
        name: 'Nice Author'
      }
    ])
    // add more INSERTs here, as appropriate
  ])
}
