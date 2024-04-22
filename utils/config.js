import { initializeApp, getApp, getApps } from 'firebase/app';
import 'firebase/firestore'; // Import Firestore module
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let firebaseApp;

export const getFirebaseApp = () => {
  // If the Firebase app is already initialized, return it
  if (firebaseApp) {
    return firebaseApp;
  }
  
  const firebaseConfig = {
    // apiKey: "AIzaSyAZ6f3ZP56UjVNSu_BcCI6EXC3RR-Sx2zQ",
    // authDomain: "web-project-b5872.firebaseapp.com",
    // databaseURL: "https://web-project-b5872-default-rtdb.asia-southeast1.firebasedatabase.app",
    // projectId: "web-project-b5872",
    // storageBucket: "web-project-b5872.appspot.com",
    // messagingSenderId: "261356705156",
    // appId: "1:261356705156:web:9edbe502ffdeba7158f9d1",
    // measurementId: "G-MS2F2TY6TN"
    apiKey: "AIzaSyBIF1_p4Bs75Dckj_3Cx8K2JIM8w4d3uIg",
  authDomain: "water-notifier-a3f4e.firebaseapp.com",
  projectId: "water-notifier-a3f4e",
  storageBucket: "water-notifier-a3f4e.appspot.com",
  messagingSenderId: "987884329623",
  appId: "1:987884329623:web:6f295ca1baa366501a27d2",
  measurementId: "G-8Y353XSG6V"
  };

  // Initialize Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Store the initialized app to avoid reinitialization
  firebaseApp = app;

  return app;
};

