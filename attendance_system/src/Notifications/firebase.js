// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9M1XKvxbQqnZhQDLZjOaOiSZ7Muha6ow",
  authDomain: "attendance-system-9c61a.firebaseapp.com",
  projectId: "attendance-system-9c61a",
  storageBucket: "attendance-system-9c61a.firebasestorage.app",
  messagingSenderId: "209978249160",
  appId: "1:209978249160:web:7db92126e0b39a00e3bafd",
  measurementId: "G-HMKNZ2B27Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
//Grant the notification permission 
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);

  //here we have taken the messaging instance and in options{ vapid_key }

  if (permission == "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BOrNMbyPo704LA_60EllLlO01V0vty7VVXaybEfuwMWRBeDduYP5wT4Hy598AZNKyzek6EmOccEaKv3tpofTTKs",
    });
    console.log('FCM Token:', token);

    // Send token to backend
    if (token) {
      try {
        await fetch('http://localhost:5000/api/notifications/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        console.log('Token saved to backend');
      } catch (err) {
        console.error('Failed to save token to backend:', err);
      }
    }
  }
}
