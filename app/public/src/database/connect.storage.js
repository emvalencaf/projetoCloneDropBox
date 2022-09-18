import { getStorage } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js'
import { app } from './app.db.js'

export const storage = getStorage(app)