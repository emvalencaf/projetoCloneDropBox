import { db } from "../database/connect.db.js"
import { ref, set, push, onValue, child, remove, off } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js"

class DropboxDatabaseService{

    constructor(db){
        this.db = db
    }

    getFirebaseRef(path, folder){

        if(!path) path = folder.join('/')

        return ref(this.db, path)
    }

    createFolder(folder, foldername){

        set(push(this.getFirebaseRef(undefined, folder)), {
            name: foldername,
            mimetype:'folder',
            path: folder.join('/')
        })

    }

    removeFile(folder, key){

        remove(child(this.getFirebaseRef(undefined, folder), key)) 


    }

    renameFile(folder, key, file){

        set(child(this.getFirebaseRef(undefined, folder), key), file)

    }

    uploadTasks(tasks, folder){

        tasks.forEach( task => {

            set(push(this.getFirebaseRef(undefined, folder)),{
                
                mimetype: task.contentType,
                name: task.name,
                size: task.size,
                path: task.fullPath
            })


        })

    }

    readFiles(folder, viewClear = () => {}, viewReadFiles = () => {}){

        onValue(this.getFirebaseRef(undefined, folder), snapshot => {

            viewClear()

            snapshot.forEach(snapshotItem =>{

                let key = snapshotItem.key
                let data = snapshotItem.val()

                viewReadFiles(data, key)
            })


        })

    }

    offFolder(path){

        off(this.getFirebaseRef(path), 'value')

    }

}

export const dropboxDatabaseService = new DropboxDatabaseService(db)