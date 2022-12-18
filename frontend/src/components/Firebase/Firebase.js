import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBzxl_TurnbrcVch1KHRRnp19F3Z_pS2l8",
    authDomain: "etet-system.firebaseapp.com",
    projectId: "etet-system",
    storageBucket: "etet-system.appspot.com",
    messagingSenderId: "928943918545",
    appId: "1:928943918545:web:eeb7690aab65aa158fe4f0",
    measurementId: "G-HR89WG79J8"
  };
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};

const logoutOauth = () => {
  signOut(auth);
};

export {
  auth,
  signInWithGoogle,
  logoutOauth,
};
