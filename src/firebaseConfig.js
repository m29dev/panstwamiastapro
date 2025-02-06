import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, remove } from 'firebase/database'
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_M_S_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)

export {
    db,
    ref,
    set,
    get,
    onValue,
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    remove,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
}
