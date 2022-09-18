import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import { firebaseConfig } from './config.db.js'

console.log('olá')
export const app = initializeApp(firebaseConfig)