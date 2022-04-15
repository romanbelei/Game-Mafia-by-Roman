import shuffle from 'lodash.shuffle';
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
let admin = [];

// signInAnonymos;
const signOutBtn = document.querySelector('#signOut');
const anonymosForm = document.querySelector('#anonymos-form');
const header = document.querySelector('#header');
const headerAdmin = document.querySelector('.headerAdmin');
const userList = document.querySelector('.userList');
const infoAdmin = document.querySelector('.infoAdmin');
const settingsForm = document.querySelector('#settings-form');

signOutBtn.addEventListener('click', onFormSignOut);
anonymosForm.addEventListener('submit', onAnonymosSignIn);
settingsForm.addEventListener('submit', onSettings);

header.style.display = 'none';
headerAdmin.style.display = 'none';
settingsForm.style.display = 'none';

const refDb = ref(db, '/');
onValue(refDb, data => {
  const loadData = data.val();
  const iterableObject = new IterableObject(loadData);
  arrayUsers = [...iterableObject];
  //якщо роль є то рендеремо її
  // перевіряємо чи аватар ввійшов якщо так то рендеремо юзерів
  if (
    arrayUsers
      .map(e => {
        return e[0].toLowerCase();
      })
      .includes(avatar.toLowerCase())
  ) {
    renderUserList(arrayUsers);
    //якщо ще невибрали адміна то слухаємо радіобаттон на Admin
    admin = arrayUsers.filter(e => e[1].admin);
    if (
      admin
        .map(e => {
          return e[0].toLowerCase();
        })
        .includes(avatar.toLowerCase())
    ) {
      //перевіряємо чи всі вибрали адміна
      if (arrayUsers.length === admin.length) {
        //рахуємо за кого більше проголосували
        //створюємо масив обєктів {user : кількість голосів}
        const adminSort = [];
        let nameUser = '';
        let countAdmin = 0;
        arrayUsers.map(e => {
          nameUser = e[0];
          let initialValue = 0;
          countAdmin = arrayUsers.reduce((acc, elem) => {
            if (nameUser === elem[1].admin) {
              return acc + 1;
            }
            return acc;
          }, initialValue);
          adminSort.push({ name: nameUser, value: countAdmin });
        });
        adminSort.sort(function (a, b) {
          return b.value - a.value;
        });

        // ведучому надаємо форму налаштувань
        if (adminSort[0].name.toLowerCase() !== avatar.toLocaleLowerCase()) {
          infoAdmin.innerHTML = `Зачекайте ведучий ${adminSort[0].name} налаштовує гру`;
          arrayUsers.map(e => {
            //знаходимо в базі свій обєкт
            if (e[0].toLowerCase() === avatar.toLowerCase()) {
              //перевіряємо чи є в нас роль якщо є видаємо алерт
              if (e[1].role) {
                alert(`ВИ ${e[1].role}`);
              }
            }
          });
        } else {
          settingsForm.style.display = 'block';
        }
      }
    } else {
      chekRadiobutton();
    }
  }
});

function onAnonymosSignIn(e) {
  e.preventDefault();
  avatar = e.target.name.value.toLowerCase();
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
        headerAdmin.style.display = 'block';
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
      headerAdmin.style.display = 'none';
      settingsForm.style.display = 'none';
      infoAdmin.style.display = 'none';
    })
    .catch(error => {
      alert(`${error.message}`);
    });
}

function chekRadiobutton() {
  var rad = document.getElementsByName('admin');
  for (var i = 0; i < rad.length; i++) {
    if (rad[i].checked) {
      return set(ref(db, avatar), { role: '', admin: rad[i].id.toLowerCase() });
      renderUserList(arrayUsers);
    }
  }
  setTimeout(chekRadiobutton, 1000);
}

function onSettings(e) {
  e.preventDefault();
  //очишчаємо у всіх поля role
  // arrayUsers.map(e => {
  //   set(ref(db, e[0]), { role: '', admin: 'avatar' });
  // console.log(`${e[0]} ${e[1].role}`);
  // });
  const mafia = Number(e.target.mafia.value);
  const doctor = Number(e.target.doctor.value);
  const sherif = Number(e.target.sherif.value);
  const shufleArray = shuffle(arrayUsers);
  const shufleArrayUser = shufleArray.filter(e => e[0].toLowerCase() !== avatar.toLowerCase());
  // console.log(shufleArrayUser[0][0]);
  // console.log(shufleArrayUser[1][0]);
  // console.log(shufleArrayUser[0][1].admin);

  //прописуємо ролі
  for (let i = 0; i < mafia; i++) {
    set(ref(db, shufleArrayUser[i][0]), { role: 'Мафія', admin: shufleArrayUser[i][1].admin });
  }
  for (let i = mafia; i < mafia + doctor; i++) {
    set(ref(db, shufleArrayUser[i][0]), { role: 'Лікар', admin: shufleArrayUser[i][1].admin });
  }
  for (let i = mafia + doctor; i < mafia + doctor + sherif; i++) {
    set(ref(db, shufleArrayUser[i][0]), { role: 'Шериф', admin: shufleArrayUser[i][1].admin });
  }
  for (let i = mafia + doctor + sherif; i < shufleArrayUser.length; i++) {
    set(ref(db, shufleArrayUser[i][0]), { role: 'Мирний', admin: shufleArrayUser[i][1].admin });
  }
  // arrayUsers.map(e => {
  //   if (!e[1].role) {
  //     set(ref(db, e[0]), { role: 'Мирний', admin: 'avatar' });
  //   }
  // });
  let infoRole = '';
  arrayUsers.map(e => {
    infoRole = `${infoRole} 
    ${e[0]}         ${e[1].role}`;
  });
  alert(infoRole);
  set(ref(db, '/'), {});
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
