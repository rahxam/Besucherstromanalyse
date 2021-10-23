const cds = require('@sap/cds')
const cookieParser = require('cookie-parser')
const express = require('express')
const webpush = require('web-push')

// handle bootstrapping events...
cds.on('bootstrap', (app) => {
  const publicVapidKey = process.env.PUBLIC_VAPID_KEY
  const privateVapidKey = process.env.PRIVATE_VAPID_KEY
  const subscriptions = []

  webpush.setGCMAPIKey(process.env.PRIVATE_GCAPI_KEY)
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
