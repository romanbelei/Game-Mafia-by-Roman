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
import { renderUserList } from './renderUsers.js';

// import { getData } from './qetSetDatabase.js';
// getData();
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
let admin = 0;

// signInAnonymos;
const signOutBtn = document.querySelector('#signOut');
const anonymosForm = document.querySelector('#anonymos-form');
const header = document.querySelector('#header');
const userList = document.querySelector('.userList');

signOutBtn.addEventListener('click', onFormSignOut);
anonymosForm.addEventListener('submit', onAnonymosSignIn);

header.style.display = 'none';

const refDb = ref(db, '/');
onValue(refDb, data => {
  const loadData = data.val();
  const iterableObject = new IterableObject(loadData);
  arrayUsers = [...iterableObject];
  // перевіряємо чи аватар ввійшов якщо так то рендеремо юзерів
  if (
    arrayUsers
      .map(e => {
        return e[0].toLowerCase();
      })
      .includes(avatar.toLowerCase())
  ) {
    renderUserList(arrayUsers);
    // //вішаємо слухачів на Юзерів
    // arrayUsers.map(e => {});
  }
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
  } else {
    signInAnonymously(auth)
      .then(() => {
        set(ref(db, avatar), { role: '', admin: '' });
        anonymosForm.style.display = 'none';
        header.style.display = 'flex';
        userList.style.display = 'block';
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
      // alert(`До побачення`);
      set(ref(db, avatar), {});
      anonymosForm.style.display = 'block';
      header.style.display = 'none';
      userList.style.display = 'none';
    })
    .catch(error => {
      alert(`${error.message}`);
    });
}

function isCheck(name) {
  return document.querySelector('input[name="' + name + '"]:checked');
}

if (avatar) {
  console.log(isCheck('r').id);
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
