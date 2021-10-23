const cds = require('@sap/cds')
const cookieParser = require('cookie-parser')
const express = require('express')
const webpush = require('web-push')
const axios = require('axios')
const jose = require('node-jose')
const xsenv = require('@sap/xsenv')

async function decryptPayload (privateKey, payload) {
  const key = await jose.JWK.asKey(
    `-----BEGIN PRIVATE KEY-----${privateKey}-----END PRIVATE KEY-----`,
    'pem',
    { alg: 'RSA-OAEP-256', enc: 'A256GCM' }
  )
  const decrypt = await jose.JWE.createDecrypt(key).decrypt(payload)
  const result = decrypt.plaintext.toString()
  return result
}

function headers (binding, namespace) {
  const result = {}

  result.Authorization = `Basic ${Buffer.from(`${binding.username}:${binding.password}`).toString(
      'base64'
    )}`

  result['sapcp-credstore-namespace'] = namespace
  return result
}

async function fetchAndDecrypt (privateKey, url, method, headers) {
  const result = await axios({ method, headers, url })
    .then((response) => response.data)
    .then((payload) => decryptPayload(privateKey, payload))
    .then(JSON.parse)

  return result.value
}

async function readCredential (binding, namespace, type, name) {
  if (process.env.name) {
    return process.env.name
  }
  return fetchAndDecrypt(
    binding.encryption.client_private_key,
    `${binding.url}/${type}?name=${encodeURIComponent(name)}`,
    'get',
    headers(binding, namespace)
  )
}

// handle bootstrapping events...
cds.on('bootstrap', async (app) => {
  const binding = xsenv.getServices({
    credstore: { tag: 'credstore' }
  }).credstore

  const publicVapidKey = await readCredential(
    binding,
    'besucherstrom',
    'password',
    'PUBLIC_VAPID_KEY'
  )
  const privateVapidKey = await readCredential(
    binding,
    'besucherstrom',
    'password',
    'PRIVATE_VAPID_KEY'
  )

  const privateGcapiKey = await readCredential(
    binding,
    'besucherstrom',
    'password',
    'PRIVATE_GCAPI_KEY'
  )
  const subscriptions = []

  webpush.setGCMAPIKey(privateGcapiKey)
  webpush.setVapidDetails(
    'mailto:maximilian.hartig@quadrio.de',
    publicVapidKey,
    privateVapidKey
  )
  app.use(cookieParser())

  app.post('/subscribe', express.json(), (req, res) => {
    subscriptions.push(req.body)
    res.status(201).json({})
  })

  app.get('/notify', (req, res) => {
    console.log(req.body)
    const payload = JSON.stringify({
      title: 'Ohne Wartezeit ins Stadion!',
      body: 'Sei 12:14 Uhr am Eingang Leneplatz'
    })

    subscriptions.forEach((subscription) => {
      webpush.sendNotification(subscription, payload).catch((error) => {
        console.error(error.stack)
      })
    })

    res.status(201).json({})
  })

  // If you do not use an approuter register csurf to handle CSRF protection

  // anonymous ping service (https://cap.cloud.sap/docs/node.js/best-practices#anonymous-ping)
  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })
})

// add more middleware after all CDS servies
// cds.on('served', () => {
// })
// delegate to default server.js:

module.exports = cds.server
