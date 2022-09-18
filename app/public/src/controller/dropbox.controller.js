import { dropboxView } from "../view/dropbox.view.js"
import { ref, set, push, onValue, child, remove, off } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js"
import { db } from "../database/connect.db.js"



class DropboxController{

    constructor(view, service){

        this.view = view
        this.service = service
        this.currentFolder = ['username']
        this.lastFolder = ''

        this.initEvents()
        this.readFiles()

        console.log(this.currentFolder)
        this.openFolder()
    }

//inicia os eventos DOM

    initEvents(){

        this.view.btnNewFolder.addEventListener('click', e => {

            let name = prompt('Digite um nome para uma nova pasta:')

            if(!name) return

            set(push(this.getFirebaseRef()), {
                originalFilename: name,
                mimetype:'folder',
                path: this.currentFolder.join('/')
            })


        })

        //evento DOM delete

        this.view.btnDelete.addEventListener('click', e => {

            this.removeTasks()
                .then(responses=> {

                    responses.forEach(response => {

                        if(response.fields.key) remove(child(this.getFirebaseRef(), response.fields.key)) 

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

            let name = prompt("Renomear o arquivo:", file.originalFilename)

            if(!name) return

            file.originalFilename = name

            set(child(this.getFirebaseRef(), li.dataset.key), file)
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

                    responses.forEach( response => {

                        set(push(this.getFirebaseRef()), response.files['input-file'])

                    })

                    this.view.uploadComplete()

                })
                .catch(err => {

                    this.view.uploadComplete()
                    console.error(err)

                })

            this.view.modalShow()
        })

    }

//pega a referência do realtime database do firebase

    getFirebaseRef(path){

        if(!path) path = this.currentFolder.join('/')

        return ref(db, path)
    }

//Método para realizar o ajax

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

//Carrega na máquina (na pasta upload) o arquivo enviado ao front-end e faz o registro dos dados do arquivo no realtime database do firebase

    uploadTask(files){

        let promises = []
        files = [...files]
        
        files.forEach(file =>{

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

        })

        return Promise.all(promises)
    }

//Remove do banco de dados e do sistema o arquivo

    removeTasks(){

        let promises = []

        console.log("dentro do removeTasks")

        this.view.getSelection().forEach(li => {

            console.log(li)

            let file = JSON.parse(li.dataset.file)
            let key = li.dataset.key

            let formData = new FormData()
            formData.append('path', file.filepath)
            formData.append('key', key)

            promises.push(this.ajax('/file','DELETE', formData))
        })
        
        return Promise.all(promises)
    }


//Dispara as funções relacionadas a barra de carregamento
    uploadProgress(evt, file){

        let timespent = Date.now() - this.startUploadTime
        let loaded = evt.loaded
        let total = evt.total
        let porcent = parseInt((loaded/total) * 100)
        let timeleft = ((100 - porcent) * timespent) / porcent

        this.view.uploadProgress({
            filename: file.name,
            timeleft,
            porcent
        })

    }

    readFiles(){

        this.lastFolder = this.currentFolder.join('/')

        onValue(this.getFirebaseRef(), snapshot => {

            this.view.clearListOfFilesAndDiretories()

            snapshot.forEach(snapshotItem =>{

                let key = snapshotItem.key
                let data = snapshotItem.val()

                this.view.readFiles(data, key)
            })


        })

    }

    openFolder(){

        if(this.lastFolder) off(this.getFirebaseRef(this.lastFolder), 'value')        
        
        this.readFiles()
    }
}


export const dropboxController = new DropboxController(dropboxView)