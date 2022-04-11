// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  signInAnonymously,
} from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { async } from '@firebase/util';

const firebaseConfig = {
  apiKey: 'AIzaSyCjURkTZP-hYQ003_umy1baP9wor83vepw',
  authDomain: 'mafia-game-by-roman.firebaseapp.com',
  databaseURL: 'https://mafia-game-by-roman-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: 'mafia-game-by-roman',
  storageBucket: 'mafia-game-by-roman.appspot.com',
  messagingSenderId: '465612943644',
  appId: '1:465612943644:web:ef0270733806ce0d7a4ad9',
  measurementId: 'G-P4VCHM8991',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase(app);
let avatar = '';
let arrayUsers = [];

// signInAnonymos;
const signOutBtn = document.querySelector('#signOut');
const anonymosForm = document.querySelector('#anonymos-form');
const signOutform = document.querySelector('#signOuts-form');

signOutBtn.addEventListener('click', onFormSignOut);
anonymosForm.addEventListener('submit', onAnonymosSignIn);

signOutform.style.display = 'none';

const refDb = ref(db, '/');
onValue(refDb, data => {
  const loadData = data.val();
  const iterableObject = new IterableObject(loadData);
  arrayUsers = [...iterableObject];
});
function onAnonymosSignIn(e) {
  e.preventDefault();
  avatar = e.target.name.value;
  if (
    arrayUsers
      .map(e => {
        return e[0].toLowerCase();
      })
      .includes(avatar.toLowerCase())
  ) {
    alert(`Ім'я ${avatar} вже існує. Введіть інше ім'я. `);
    anonymosForm.reset();
  } else {
    signInAnonymously(auth)
      .then(() => {
        alert(`Привіт ${avatar}`);
        set(ref(db, avatar), { role: '' });
        anonymosForm.style.display = 'none';
        signOutform.style.display = 'block';
      })
      .catch(error => {
        alert(`${error.message}`);
      });
  }
}

// sign out
function onFormSignOut(e) {
  signInAnonymously(auth)
    .then(() => {
      alert(`До побачення`);
      set(ref(db, avatar), {});
      anonymosForm.style.display = 'block';
      signOutform.style.display = 'none';
    })
    .catch(error => {
      alert(`${error.message}`);
    });
}

class IterableObject extends Object {
  constructor(object) {
    super();
    Object.assign(this, object);
  }

  [Symbol.iterator]() {
    const entries = Object.entries(this);
    let index = -1;

    return {
      next() {
        index++;

        return {
          value: entries[index],
          done: index >= entries.length,
        };
      },
    };
  }
}
