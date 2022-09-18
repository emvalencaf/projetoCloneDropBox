import { storage } from "../database/connect.storage.js"
import { ref, uploadBytesResumable, getMetadata, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js'

class DropboxStorageService{

    constructor(storage){
        this.storage = storage
    }

//pegar as referências do storage
    getStorageRef(folder, taskname){

        return ref(this.storage, folder.join("/") + "/" + taskname)
    
    }

//upload de arquivo do front-end
    uploadTask(task, folder){

        const taskRef = ref(this.getStorageRef(folder, task.name))

        const taskMetadata = {
            contentType: task.type
        }

        return uploadBytesResumable(taskRef, task, taskMetadata)
    }

//get metadados do arquivo
    getMetadata(folder, taskname){

        return getMetadata(this.getStorageRef(folder, taskname))

    }
//get downloadURL
    getTaskDownloadURL(ref){

        return getDownloadURL(ref)


    }
}

export const dropboxStorageService = new DropboxStorageService(storage)