import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FB_DATABASE_URL,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

console.log(firebaseConfig);

// TODO: move into a context provider so we can use it in the app

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function getUserData() {
  try {
    const auth = getAuth();
    const { user } = await signInAnonymously(auth);
    const userRef = ref(database, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      console.log(userSnapshot.val());
    } else {
      console.log('No user data available');
    }

    const settings = await get(child(userRef, 'settings'));
    console.log(settings.val());
  } catch (err) {
    console.log(err);
  }
}
