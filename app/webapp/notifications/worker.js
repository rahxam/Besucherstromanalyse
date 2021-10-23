/* globals self */
console.log('Loaded service worker!')

self.addEventListener('push', ev => {
  const data = ev.data.json()
  console.log('Got push', data)
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://besucherstrom.cfapps.eu10.hana.ondemand.com/webapp/notifications/dynamo.png'
  })
})
