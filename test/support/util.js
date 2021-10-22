/* eslint-disable indent */
const expect = require('chai').expect
// const { DateTime } = require('luxon')
const server = require('../support/server')

// eslint-disable-next-line no-unused-vars
const { GET, POST, PATCH, DELETE } = server.httpOperations()

module.exports = new class {
    /**
     * CAP has not support for odata.metadata=full, therefore all url must be build by hand
     * this is a helper to do so
     * @param {*} param0 new Date().toISOString().split("T")[0]

    constructURL({ entity, keys, values }) {
        const _keys = keys.map((val) => { return val + '=' + values[val] }).join(',')
        return `/${entity}(${_keys})`
    }
    */

    /**
     * helper to generate dynamically test for read set requests
     * @param {*} collections
     */
    testEntitySetRead (collections) {
        const TOP = 2
        for (const element of collections) {
            it(element + ' read set', async () => {
                const res = await GET(`/${element}?skip=0&$top=${TOP}`)
                expect(res).to.have.status(200)
                expect(res.body.value).to.have.lengthOf.at.most(TOP)
                // if (res.body.value.length > TOP)
                //    console.log(`\treceived ${res.body.value.length} items. THAT IS TO LONG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
                // else
                console.info(`\treceived ${res.body.value.length} items`)
            })
        }
    }
}()
