// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';

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
const auth = getAuth();

const authForm = document.querySelector('#auth-form');
const registerForm = document.querySelector('#register-form');
const signOutBtn = document.querySelector('#signOut');

registerForm.addEventListener('submit', onFormSignUp);
authForm.addEventListener('submit', onFormSignIn);
signOutBtn.addEventListener('click', onFormSignOut);

// sign up
// під час реєстрації потрібно:
//  зробити автологування
//  сховати форму реєстрації
// сховати всі кнопки sign in, sign up
// має зявитись sign out

function onFormSignUp(e) {
  e.preventDefault();
  const userEmail = e.target.registerEmail.value;
  const userPassword = e.target.registerPassword.value;
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then(userCredential => {
      const user = userCredential.user;
      console.log(user);
      alert(`Успішно зареєстрований`);
      authForm.style.display = 'none';
      registerForm.style.display = 'none';
    })
    .catch(error => {
      alert(`${error.message}`);
    });
}

// // sign in
function onFormSignIn(e) {
  e.preventDefault();
  const userEmail = e.target.logInEmail.value;
  const userPassword = e.target.logInPassword.value;
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(() => {
      alert(`Привіт ${userEmail}`);
      authForm.style.display = 'none';
      registerForm.style.display = 'none';
    })
    .catch(error => alert(`${error.message}`));
}

// sign out
function onFormSignOut(e) {
  signOut(auth)
    .then(() => {
      alert(`До побачення`);
      authForm.style.display = 'block';
      registerForm.style.display = 'block';
    })
    .catch(error => {
      alert(`${error.message}`);
    });
}
