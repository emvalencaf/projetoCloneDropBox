import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import { app } from '../app.firebase.js'


export const db = getDatabase(app)
//export const db = getDatabase(app)