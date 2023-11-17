/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import notificationLogo from "./assets/instagram-64.png"

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // A new Service Worker has become active, indicating an update
    window.location.reload();
  });
}

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// const CACHE_NAME = 'service-worker-cache-v1';

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => {
//       return cache.addAll([
//         '/auth',
//       ]);
//     })
//   );
// });

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener('push', (event) => {
  console.log("got push notification");
  const notificationPush = JSON.parse(event.data.text()).notification
  console.log("notificationPush:", notificationPush)
 
  const options = {  
    body: notificationPush.body,
    icon: notificationLogo,
    vibrate: [100, 50, 100],
    actions: [
      {action: 'like', title: 'Like'},
      {action: 'reply', title: 'Reply'}
    ]
  }
  event.waitUntil(
    self.registration.showNotification(notificationPush.title,
    options))
})

self.addEventListener('notificationclick', function(event) {
  var messageId = event.notification.data;

  event.notification.close();

  if (event.action === 'like') {
    // silentlyLikeItem();
    console.log('like');
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
          // Check if the client is currently focused on a specific page
        for (const client of clientList) {
          if (client.url === 'http://localhost:3000/profile') {
            if (client.focused) {
              return;
            }
            else {
              client.navigate('http://localhost:3000/auth');
              return client.focus();
            }
          }
        }
        console.log("client is not on the page"); 
        return self.clients.openWindow('http://localhost:3000/profile');
      })
    )
  }
  else if (event.action === 'reply') {
    console.log('reply');
    // clients.openWindow("/messages?reply=" + messageId);
  }
  else {
    console.log('reply' + messageId);

    // clients.openWindow("/messages?reply=" + messageId);
  }
}, false);

