import { dropboxView } from "../view/dropbox.view.js"
import { ref, set, push } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js"
import { db } from "../database/connect.db.js"


class DropboxController{

    constructor(view, service){

        this.view = view
        this.service = service

        this.initEvents()

    }

    initEvents(){

        this.view.btnSendFileEl.addEventListener('click', evt =>{

            this.view.inputFilesEl.click()

        })

        this.view.inputFilesEl.addEventListener("change", evt =>{

            this.uploadTask(evt.target.files)
                .then(responses => {

                    responses.forEach( response => {

                        set(push(this.getFirebaseRef()), response.files['input-file'])

                    })

                    this.view.modalShow(false)

                })

                this.view.modalShow()
                this.view.inputFilesEl.value = ""
        })

    }

    getFirebaseRef(){

        return ref(db, 'files')

    }

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
}


export const dropboxController = new DropboxController(dropboxView)