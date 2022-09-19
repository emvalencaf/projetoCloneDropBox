import { db } from "../firebase/database/connect.db.js"
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
            originalFilename: foldername,
            mimetype:'folder',
            path: folder.join('/')
        })

    }

    removeFolderTask(folder, folderFilename, storageRemove = ()=>{}, key){
        return new Promise((resolve, reject) => {

            let folderRef = this.getFirebaseRef(folder + "/" + folderFilename)
            console.log(folder + "/" + folderFilename)
            console.log(folderRef)
            onValue(folderRef, snapshot =>{
    

                snapshot.forEach(item => {
                    console.log(item)
                    let data = item.val()
                    data.key = item.key
                    this.offFolder(undefined, folderRef)
                    
                    if(data.mimetype === 'folder'){
                        
                        this.removeFolderTask(folder + "/" + folderFilename, data.originalFilename, key)
                            .then(()=>{

                                resolve({
                                    fields:{key: data.key}
                                })

                            })
                            .catch(err=>{

                                console.error(err)

                            })
    
                    } else if(data.mimetype){
                        console.log(storageRemove)
                        storageRemove(undefined, data.path)
                            .then(()=>{

                                resolve({
                                    fields: {key: data.key}
                                })
                                
                            })
                            
                            .catch(err => {
                                
                                console.error(err)
                                reject(err)
                                
                            })
                            
                        }
                        
                        
                    })
                    
                    remove(folderRef)
                    
                })
            
        })

    }

    removeFile(folder, key){

        const path = child(this.getFirebaseRef(undefined, folder), key)

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
                originalFilename: task.name,
                size: task.size,
                path: task.fullPath,
                url: task.url
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

    offFolder(path, folderRef){

        if(!folderRef) return off(this.getFirebaseRef(path), 'value')

        off(folderRef, 'value')
    }

}

export const dropboxDatabaseService = new DropboxDatabaseService(db)