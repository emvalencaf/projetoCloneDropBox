import { dropboxView } from "../view/dropbox.view.js"
import { dropboxDatabaseService } from "../service/dropbox.database.service.js"
import { dropboxStorageService } from "../service/dropbox.storage.service.js"



class DropboxController{

    constructor(view, dbService, storageService){

        this.view = view
        this.service = {
            db: dbService,
            storage: storageService
        }
        this.currentFolder = ['username']
        this.lastFolder = ''

        this.initEvents()
        this.readFiles()

        this.openFolder()
    }

//inicia os eventos DOM

    initEvents(){

        this.view.btnNewFolder.addEventListener('click', e => {

            let name = prompt('Digite um nome para uma nova pasta:')

            if(!name) return

            this.service.db.createFolder(this.currentFolder, name)
/*
            set(push(this.getFirebaseRef()), {
                originalFilename: name,
                mimetype:'folder',
                path: this.currentFolder.join('/')
            })*/


        })

        //evento DOM delete

        this.view.btnDelete.addEventListener('click', e => {

            this.removeTasks()
                .then(responses=> {

                    responses.forEach(response => {

                        if(response.fields.key) this.service.db.removeFile(this.currentFolder, response.fields.key)//remove(child(this.getFirebaseRef(), response.fields.key)) 

                    })

                })
                .catch(err => {

                    console.error(err)

                })

        })

        //evento DOM de renomear arquivo
        
        this.view.btnRename.addEventListener('click', e => {

            let li = this.view.getSelection()[0]
            let file = JSON.parse(li.dataset.file)

            let name = prompt("Renomear o arquivo:", file.name)
            
            if(!name) return

            file.name = name

            this.service.db.renameFile(this.currentFolder, li.dataset.key, file)//set(child(this.getFirebaseDBRef(), li.dataset.key), file)
            
        })

        this.view.listFilesEl.addEventListener('selectionchange', e => {

            this.view.showMenuOrgOptions()

        })

        //evento DOM de enviar arquivo pra realtime database

        this.view.btnSendFileEl.addEventListener('click', evt =>{

            this.view.inputFilesEl.click()

        })

        this.view.inputFilesEl.addEventListener("change", evt =>{

            this.view.btnSendFileEl.disabled = true

            this.uploadTask(evt.target.files)
                .then(responses => {
/*
                    responses.forEach( response => {

                        set(push(this.getFirebaseRef()), response.files['input-file'])

                    })*/
                    this.service.db.uploadTasks(responses, this.currentFolder)

                    this.view.uploadComplete()

                })
                .catch(err => {

                    this.view.uploadComplete()
                    console.error(err)

                })

            this.view.modalShow()
        })

    }

//pega a refer??ncia do realtime database do firebase
/*
    getFirebaseRef(path){

        if(!path) path = this.currentFolder.join('/')

        return ref(db, path)
    }*/

//M??todo para realizar o ajax

    ajax(url, method = 'GET', formData = new FormData(), onprogress = () => {}, onloadstart = () => {}){

        return new Promise( (resolve, reject) =>{

            let ajax = new XMLHttpRequest()
    
            ajax.open(method.toUpperCase(), url)
    
            ajax.onload = evt => {
    
                try{
    
                    resolve(JSON.parse(ajax.responseText))
    
                }catch(e){
    
                    reject(e)
    
                }
    
            }
            
            ajax.error = evt => {

                reject(evt)
                
            }

            ajax.upload.onprogress = onprogress
    
            onloadstart()
    
            ajax.send(formData)

        })

    }

//Carrega o arquivo enviado ao front-end no storage do firebase e faz o registro dos dados do arquivo no realtime database do firebase

    uploadTask(files){

        let promises = []
        files = [...files]
        
        files.forEach(file =>{
            
            promises.push(new Promise((resolve, reject) => {

                const task = this.service.storage.uploadTask(file, this.currentFolder)
    
                this.startUploadTime = Date.now()
                task.on(

                    'state_changed',

                    (snapshot) => {
                        console.log('progress', snapshot)
                        this.uploadProgress({
                            loaded: snapshot.bytesTransferred,
                            total: snapshot.totalBytes
                        }, file)
                    },

                    (err)=>{
                        console.error(err)
                        reject()
                    },

                    ()=>{

                        this.service.storage.getTaskDownloadURL(task.snapshot.ref)
                            .then((downloadURL) =>{
                                task._metadata.url = downloadURL

                                resolve(task._metadata)
                            })

/*
                        this.service.storage.getMetadata(this.currentFolder, file.name)
                        .then(metadata =>{
                            
                            resolve(metadata)

                            })
                            
                            .catch(err => {
                                reject(err)
                            })*/
                    }
                )
                
            }))
/*
            let formData = new FormData()
            
            formData.append('input-file', file)

            let promise = this.ajax('/upload',
            'POST',
            formData,
            (evt) => {

                this.uploadProgress(evt, file)
            
            },
            () => {

                this.startUploadTime = Date.now()

            })

            promises.push(promise)
*/
        })

        return Promise.all(promises)
    }

//Remove do banco de dados e do sistema o arquivo
    removeFolderTask(folder, folderFilename, key){

        return this.service.db.removeFolderTask(folder.join('/'), folderFilename, this.service.storage.removeTask.bind(this.service.storage), key)

    }

    removeTasks(){

        let promises = []


        this.view.getSelection().forEach(li => {

            console.log(li)

            let file = JSON.parse(li.dataset.file)
            let key = li.dataset.key

            promises.push(new Promise(async (resolve, reject) => {

                if(file.mimetype === 'folder'){

                    await this.removeFolderTask(this.currentFolder, file.originalFilename, key)

                    this.service.db.removeFile(this.currentFolder, key)

                } else if(file.mimetype){

                    this.service.storage.removeTask(this.currentFolder, file.originalFilename)
                        .then(()=>{
    
                            resolve({fields:{key}})
    
                        })
                        .catch(err=>{
    
                            console.error(err)
                            reject(err)
    
                        })   
                    
                }
                

            }))
/*
            let formData = new FormData()
            formData.append('path', file.filepath)
            formData.append('key', key)

            promises.push(this.ajax('/file','DELETE', formData))*/
        })
        
        return Promise.all(promises)
    }


//Dispara as fun????es relacionadas a barra de carregamento
    uploadProgress(evt, file){

        let timespent = Date.now() - this.startUploadTime
        let loaded = evt.loaded
        let total = evt.total
        let porcent = parseInt((loaded / total) * 100)
        let timeleft = ((100 - porcent) * timespent) / porcent

        this.view.uploadProgress({
            name: file.name,
            timeleft,
            porcent
        })

    }

    readFiles(){

        this.lastFolder = this.currentFolder.join('/')

        this.service.db.readFiles(
            this.currentFolder,
            this.view.clearListOfFilesAndDiretories.bind(this.view),
            this.view.readFiles.bind(this.view)
        )
/*
        onValue(this.getFirebaseRef(), snapshot => {

            this.view.clearListOfFilesAndDiretories()

            snapshot.forEach(snapshotItem =>{

                let key = snapshotItem.key
                let data = snapshotItem.val()

                this.view.readFiles(data, key)
            })


        })*/

    }

//navega????o de pastas
    openFolder(){

        if(this.lastFolder) this.service.db.offFolder(this.lastFolder)//off(this.getFirebaseRef(this.lastFolder), 'value')
        
        
        this.renderNav()
        this.readFiles()
    }

    renderNav(){

        this.view.renderNav(this.currentFolder)

        this.view.navEl.querySelectorAll('a').forEach(a => {

            a.addEventListener("click", e => {

                e.preventDefault()

                this.currentFolder = a.dataset.path.split('/')

                this.openFolder()
            })

        })

    }
}


export const dropboxController = new DropboxController(dropboxView, dropboxDatabaseService, dropboxStorageService)