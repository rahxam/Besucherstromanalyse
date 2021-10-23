/* globals self */
console.log('Loaded service worker!')

self.addEventListener('push', ev => {
  const data = ev.data.json()
  console.log('Got push', data)
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://static.wikia.nocookie.net/logopedia/images/0/06/Dynamo_Dresden_logo_2011.svg/revision/latest/scale-to-width-down/200?cb=20170911143818'
  })
})
