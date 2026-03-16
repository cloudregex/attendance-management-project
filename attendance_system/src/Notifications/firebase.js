// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getMessaging , getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjH-Ypd3zB9DwxNGnxsDY3fFlhJgA_7t4",
  authDomain: "fir-d63db.firebaseapp.com",
  projectId: "fir-d63db",
  storageBucket: "fir-d63db.firebasestorage.app",
  messagingSenderId: "1873747514",
  appId: "1:1873747514:web:e8fb546d694d91bc2b5f03",
  measurementId: "G-FED652HSVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
//Grant the notification permission 
export const generateToken  =  async () =>{
    const permission  = await Notification.requestPermission();
    console.log(permission);

    //here we have taken the messaging instance and in options{ vapid_key }

    if(permission == "granted")
    {
    const token = await getToken(messaging ,{
        vapidKey:"BFm7YsjI5S8yUm9rHHNgKmQmRHCa7J2-lD0kOM-NrwlUbfzLxSpybYgbgAun6IAJUaxZUpYG6ZyA0HVVkyejIBk",
    } );
    console.log(token);
    }
}