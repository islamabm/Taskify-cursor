// console.log('[firebase-messaging-sw.js] config 0');

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// console.log('[firebase-messaging-sw.js] config 1');

const firebaseConfig = {
    apiKey: "AIzaSyBvKNlkGAGixD9J-JUCVbHY3dcYQ-H6J5w",
    authDomain: "nestjs-6ef33.firebaseapp.com",
    projectId: "nestjs-6ef33",
    storageBucket: "nestjs-6ef33.firebasestorage.app",
    messagingSenderId: "246458554466",
    appId: "1:246458554466:web:2a17815e72fd5c8ac6d93b",
    measurementId: "G-S4Q5XY6080",
};

// REACT_APP_VAPID_KEY=BKsDS1O9enCTqzDwrvqkEO09u3OICEcmdp-nT9qPsSg_q_bMoIi20TXzFB_u6KhWE2ffGEZmWzJ9D6_PsAuUvVA

// console.log("firebaseConfig", firebaseConfig)





// console.log('[firebase-messaging-sw.js] config 2');

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// console.log('[firebase-messaging-sw.js] config 3');

messaging.onBackgroundMessage(function (payload) {
    // console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});