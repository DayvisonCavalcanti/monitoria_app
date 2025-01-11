// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4E2jLOASCGg1h0QWhqTddfC067QBxJNE",
  authDomain: "monitoria-ifpe.firebaseapp.com",
  projectId: "monitoria-ifpe",
  storageBucket: "monitoria-ifpe.firebasestorage.app",
  messagingSenderId: "535342942901",
  appId: "1:535342942901:web:40a5cdd28a06be502b8cfc",
  measurementId: "G-1P874DFJ9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };