import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  aapiKey: "AIzaSyBzxl_TurnbrcVch1KHRRnp19F3Z_pS2l8",
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
    // const user = res.user;
    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  signInWithGoogle,
  logout,
};
