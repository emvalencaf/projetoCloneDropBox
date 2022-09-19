import { getStorage } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js'
import { app } from '../app.firebase.js'

export const storage = getStorage(app)