/* c8 ignore start */
/* global chai */
const axios = require('axios').default
const cds = require('@sap/cds')

const defaults = {
  user: 'admin',
  pw: '1234',
  baseUrl: 'http://localhost:4004'
}

module.exports = new class {
  constructor () {
    this.URLToRunningServer = null
    this._agent = null
  }

  // get url() { return this.URLToRunningServer }
  get agent () {
    return this._agent
  }

  /**
   * shorthand to make it more readable
   * @param {*} param0
   */
  httpOperations () {
    return {
      GET: (url) => this.agent.get(url),
      PATCH: (url, data) => this.agent.patch(url).send(data).type('json'),
      POST: (url, data) => this.agent.post(url).send(data).type('json'),
      DELETE: (url) => this.agent.delete(url)
    }
  }

  agentFactory ({ urlSuffix, auth }) {
    const urlMatches2 = this.baseUrl.match(/(\w*:?\/\/)(.+)/)
    this.baseUrl = urlMatches2[1] + auth.user + ':' + auth.pw + '@' + urlMatches2[2]

    this._agent = chai.request.agent(this.baseUrl + urlSuffix)
    return this._agent
      .get('/')
      .set('Accept', 'application/json')
      .catch((e) => {
        console.error('something went wrong', e)
        throw e
      })
  }

  boot () {
    if (!this.connected) {
      this.connected = axios.get(defaults.baseUrl)
        .then(() => {
          console.log('\t\tserver.js ==> found a server (no test coverage !! ) at ' + defaults.baseUrl)

          return {
            server: null,
            baseUrl: defaults.baseUrl
          }
        })
        .catch(() => {
          console.log('\t\tserver.js ==> found no server; booting cds')
          // eslint-disable-next-line no-unused-vars
          return new Promise((resolve, reject) => {
            cds.exec('run', '--in-memory', '--port', '0')
            // eslint-disable-next-line no-unused-vars
            cds.once('listening', ({ server, url }) => {
              resolve({
                server: server,
                baseUrl: url
              })
            })
          })
        })
    } else {
      console.log('\t\tserver.js ==> reuse existing connection ' + this.baseUrl)
    }
  }

  /**
   * Connects to a server or boots an connect.
   * If there is no urlSuffix, it boots only.
   * Agent stays initial till the next connect() call with suffix(service-name)
   *
   *
   * @param {object} mochaEnv
   * @param {string} [urlSuffix] - targeted service name
   */
  connect (mochaEnv, urlSuffix, auth = defaults) {
    mochaEnv.timeout(250000)

    // const auth = (_auth || defaults)
    this.boot()
    if (urlSuffix) {
      return this.connected.then(({ baseUrl, server }) => {
        this.server = server
        this.baseUrl = baseUrl

        this.agentFactory({ urlSuffix, auth })
      })
    } else { return this.connected }
  }

  reset () {
    return axios
      .post(this.baseUrl + '/test/reset', {})
      .catch((e) => {
        console.error(e)
        throw e
      })
  }

  close () {
    return new Promise((resolve) => {
      if (!this.server) return resolve()

      this.server.close(() => {
        console.log('\t\tserver.js ==> closed running server')
        resolve()
      })
    })
  }
}()
/* c8 ignore end */
