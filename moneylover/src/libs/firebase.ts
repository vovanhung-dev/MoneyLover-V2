import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH,
	projectId: import.meta.env.VITE_FIREBASE_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_SENDERID,
	appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};