import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA9CSq5VrkJ_qsEAgr-EfsmUJbM93l5oEA",
    authDomain: "sendtextnow-b7757.firebaseapp.com",
    projectId: "sendtextnow-b7757",
    storageBucket: "sendtextnow-b7757.appspot.com",
    messagingSenderId: "390987434126",
    appId: "1:390987434126:web:9efd8ee16ff934720321df"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
export default db;

