// firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken as getFirebaseToken, onMessage, Messaging } from 'firebase/messaging';
//
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvKNlkGAGixD9J-JUCVbHY3dcYQ-H6J5w",
    authDomain: "nestjs-6ef33.firebaseapp.com",
    projectId: "nestjs-6ef33",
    storageBucket: "nestjs-6ef33.firebasestorage.app",
    messagingSenderId: "246458554466",
    appId: "1:246458554466:web:2a17815e72fd5c8ac6d93b",
    measurementId: "G-S4Q5XY6080",
};

//islam
//hhh

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(firebaseApp);

/**
 * Set up an onMessage listener with a callback.
 * @param {function} callback - The function to call when a message is received.
 * @returns {function} - A function to unsubscribe the listener.
 */
export const onMessageListener = (callback: (payload: any) => void): (() => void) => {
    const unsubscribe = onMessage(messaging, (payload) => {
        callback(payload);
    });
    return unsubscribe;
};

/**
 * Request the Firebase token.
 * @returns {Promise<string | null>} - The current token or null if unavailable.
 */
export const requestFirebaseToken = async (): Promise<string | null> => {
    try {
        const currentToken = await getFirebaseToken(messaging, { vapidKey: "BKsDS1O9enCTqzDwrvqkEO09u3OICEcmdp-nT9qPsSg_q_bMoIi20TXzFB_u6KhWE2ffGEZmWzJ9D6_PsAuUvVA" });
        if (currentToken) {
            // You might want to send the token to your backend here
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
        }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
        return null;
    }
};
