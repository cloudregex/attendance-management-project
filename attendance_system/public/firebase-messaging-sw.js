// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({  
  apiKey: "AIzaSyC9M1XKvxbQqnZhQDLZjOaOiSZ7Muha6ow",
  authDomain: "attendance-system-9c61a.firebaseapp.com",
  projectId: "attendance-system-9c61a",
  storageBucket: "attendance-system-9c61a.firebasestorage.app",
  messagingSenderId: "209978249160",
  appId: "1:209978249160:web:7db92126e0b39a00e3bafd",
  measurementId: "G-HMKNZ2B27Y"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});