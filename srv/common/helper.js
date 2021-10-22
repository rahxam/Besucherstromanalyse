module.exports.const = {}

module.exports.reject = function (req) {
  req.reject(500)
}

module.exports.addFilterToQuery = function (query, filterArray) {
  const connector = 'and'

  if (filterArray === undefined || filterArray === null || filterArray === []) {
    return query
  }

  if (
    query.SELECT.where !== undefined &&
    query.SELECT.where &&
    query.SELECT.where.length > 0
  ) {
    query.SELECT.where = ['('].concat(query.SELECT.where)
    query.SELECT.where.push(')')
    query.SELECT.where.push(connector)
  } else {
    query.SELECT.where = []
  }

  query.SELECT.where = query.SELECT.where.concat(filterArray)

  return query
}

module.exports.getFilterValue = function (req, filterEntity, comparator) {
  const query = req.query
  let result = null
  const queryString = JSON.stringify(query)

  if (
    queryString && queryString.includes(
      '{"ref":["' + filterEntity + '"]},"' + comparator + '",{'
    )
  ) {
    // Extracting the date from query String
    const queryFilter = query.SELECT.where || query.SELECT.from.ref[0].where

    let counter = 0
    for (const filterpart of queryFilter) {
      if (
        filterpart.ref &&
        (filterpart.ref === filterEntity || filterpart.ref[0] === filterEntity) &&
        queryFilter[counter + 1] === comparator
      ) {
        // console.debug(queryFilter[counter + 2].val)
        result = queryFilter[counter + 2].val
        break
      }
      counter++
    }
  }
  return result
}

module.exports.getFilterValueOrFail = function (req, filterEntity, comparator) {
  const result = module.exports.getFilterValue(req, filterEntity, comparator)
  if (result === null) {
    req.error(400, `Filter ${filterEntity} is mandatory`)
  }
  return result
}
