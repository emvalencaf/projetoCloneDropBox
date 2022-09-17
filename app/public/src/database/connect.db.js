import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import { app } from './app.db.js'


export const db = getDatabase(app)