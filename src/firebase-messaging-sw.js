// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    // REPLACE BY YOUR FIREBASE CONFIG HERE
    apiKey: "AIzaSyCVJqzY9ZTRFRJ5Cg-AqCMd1uOcRUSGQLU",
    authDomain: "youps-tracking.firebaseapp.com",
    databaseURL: "https://youps-tracking.firebaseio.com",
    projectId: "youps-tracking",
    storageBucket: "youps-tracking.appspot.com",
    messagingSenderId: "393607254966",
    appId: "1:393607254966:web:8c62b8973959c9398f2717"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();