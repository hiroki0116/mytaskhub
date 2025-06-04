import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH8RWR1Ze8-wN-VBXHBQs96TDa_Pt_w3g",
  authDomain: "mytaskhub-79d7f.firebaseapp.com",
  projectId: "mytaskhub-79d7f",
  storageBucket: "mytaskhub-79d7f.firebasestorage.app",
  messagingSenderId: "913740156570",
  appId: "1:913740156570:web:2b9b8eb70cae1b02821923",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
