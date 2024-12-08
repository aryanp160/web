import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDRNZkLAtPtJj6Ll-vrlr56wYXjR2yWodA",
    authDomain: "bl-read.firebaseapp.com",
    projectId: "bl-read",
    storageBucket: "bl-read.firebasestorage.app",
    messagingSenderId: "494309755924",
    appId: "1:494309755924:web:938b88065ece7a83b46b01",
    measurementId: "G-QVLGQB1XPZ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in: ", user);
    } catch (error) {
      console.error("Error signing in: ", error.message);
    }
  };
const signOutUser = async () => {
  await signOut(auth);


};


const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Error during logout:", error.message);
      });
  };
export { auth, db, signInWithGoogle, signOutUser, logOut };