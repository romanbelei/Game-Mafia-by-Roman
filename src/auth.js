// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDyDgzI_bPeljmgMmOE_ydsk6-uC9s-z44',
  authDomain: 'filmoteka-418dc.firebaseapp.com',
  databaseURL: 'https://filmoteka-418dc-default-rtdb.firebaseio.com',
  projectId: 'filmoteka-418dc',
  storageBucket: 'filmoteka-418dc.appspot.com',
  messagingSenderId: '844992729026',
  appId: '1:844992729026:web:d52e8c884494acc227d05b',
  measurementId: 'G-XX5M9G1BCJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
