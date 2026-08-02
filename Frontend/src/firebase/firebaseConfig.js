import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-Oppj8U8t8o_jK1C8LX6TFL3a8EZ4gMY",
  authDomain: "cookcraft-fae4d.firebaseapp.com",
  projectId: "cookcraft-fae4d",
  appId: "1:254068728789:web:e2c4aac0742d7f6152135c",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, googleProvider };