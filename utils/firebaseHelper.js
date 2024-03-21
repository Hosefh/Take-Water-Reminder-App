import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let firebaseApp;

export const getFirebaseApp = () => {
  // If the Firebase app is already initialized, return it
  if (firebaseApp) {
    return firebaseApp;
  }

  // Firebase configuration
  //  const firebaseConfig = {
  //     apiKey: "AIzaSyCn1YTRtMMyabNT8R0U8USVYENMsQs7fYU",
  //     authDomain: "authfirebasetest-c8659.firebaseapp.com",
  //     projectId: "authfirebasetest-c8659",
  //     storageBucket: "authfirebasetest-c8659.appspot.com",
  //     messagingSenderId: "82132307372",
  //     appId: "1:82132307372:web:b84fc4b04135558b7a7e09",
  //     measurementId: "G-LT3CX4VJY3"
  //   };
  const firebaseConfig = {
    apiKey: "AIzaSyAZ6f3ZP56UjVNSu_BcCI6EXC3RR-Sx2zQ",
    authDomain: "web-project-b5872.firebaseapp.com",
    databaseURL: "https://web-project-b5872-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "web-project-b5872",
    storageBucket: "web-project-b5872.appspot.com",
    messagingSenderId: "261356705156",
    appId: "1:261356705156:web:9edbe502ffdeba7158f9d1",
    measurementId: "G-MS2F2TY6TN"
  };
  
  // Initialize Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Initialize Firebase Auth with React Native persistence
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  // Store the initialized app to avoid reinitialization
  firebaseApp = app;

  return app;
};

