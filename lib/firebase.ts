import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBY29AI18KewuRzVFcB3JSwpZosBr857VU",
  authDomain: "legaltech-a39bf.firebaseapp.com",
  projectId: "legaltech-a39bf",
  storageBucket: "legaltech-a39bf.firebasestorage.app",
  messagingSenderId: "911760651836",
  appId: "1:911760651836:web:4b50dfba03840260e9f539",
  measurementId: "G-LR6LF5MYQ8"
};
//console.log(firebaseConfig.apiKey);

// Initialize Firebase only if it hasn't been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export { auth };