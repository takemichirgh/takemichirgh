// firebase.js

// Importar Firebase via CDN (para navegador)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// CONFIG DO SEU FIREBASE (já preenchido)

const firebaseConfig = {
  apiKey: "AIzaSyDi1RRUhYN7eeT_l5JR-6QUp2Jq5OPIST0",
  authDomain: "takemichirgh-8346e.firebaseapp.com",
  databaseURL: "https://takemichirgh-8346e-default-rtdb.firebaseio.com",
  projectId: "takemichirgh-8346e",
  storageBucket: "takemichirgh-8346e.firebasestorage.app",
  messagingSenderId: "1027920659606",
  appId: "1:1027920659606:web:399e57e6fe5d078e5f2eb7"
};


// Inicializar Firebase

const app = initializeApp(firebaseConfig);


// Banco de dados

const db = getDatabase(app);


// Caminho onde os jogos ficam

const jogosRef = ref(db, "jogos");


// Exportar funções para usar no script.js

export {
  db,
  jogosRef,
  ref,
  push,
  set,
  update,
  remove,
  onValue
};
