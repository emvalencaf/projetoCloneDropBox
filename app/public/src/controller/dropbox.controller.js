import { dropboxView } from "../view/dropbox.view.js"
import { ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js"
import { db } from "../database/connect.db.js"



class DropboxController{

    constructor(view, service){

        this.view = view
        this.service = service

        this.initEvents()
        this.readFiles()

    }

//inicia os eventos DOM

    initEvents(){

        this.view.listFilesEl.addEventListener('selectionchange', e => {

            this.view.showMenuOrgOptions()

        })

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

    getFirebaseRef(){

        return ref(db, 'files')

    }

//Carrega na máquina (na pasta upload) o arquivo enviado ao front-end e faz o registro dos dados do arquivo no realtime database do firebase

    uploadTask(files){

        let promises = []
        files = [...files]
        
        files.forEach(file =>{

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest()

                ajax.open('POST', '/upload')

                ajax.onload = evt => {

                    try{

                        resolve(JSON.parse(ajax.responseText))

                    }catch(e){

                        reject(e)

                    }

                }

                ajax.upload.onprogress = evt =>{

                    this.uploadProgress(evt, file)

                }

                let formData = new FormData()

                formData.append('input-file', file)

                this.startUploadTime = Date.now()

                ajax.send(formData)

            }))

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

        onValue(this.getFirebaseRef(), snapshot => {

            this.view.clearListOfFilesAndDiretories()

            snapshot.forEach(snapshotItem =>{

                let key = snapshotItem.key
                let data = snapshotItem.val()

                console.log(key)
                console.log(data)

                this.view.readFiles(data, key)
            })


        })

    }
}


export const dropboxController = new DropboxController(dropboxView)