
import { FormatTime } from "../utils/formatTime.utils.js"
import { SvgView } from "./svg.view.js"

class DropboxView{

    //enviar arquivos DOM
    btnSendFileEl = document.querySelector('#btn-send-file')
    inputFilesEl = document.querySelector('#files')

    
    //barra de progresso DOM
    snackModalEl = document.querySelector('#react-snackbar-root')
    progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg")
    nameFileEl = this.snackModalEl.querySelector(".filename")
    timeleftEl = this.snackModalEl.querySelector('.timeleft')

    // li DOM
    listFilesEl = document.querySelector("#list-of-files-and-directories")
    onSelectionChange = new Event('selectionchange')

    //btns de organização
    btnNewFolder = document.querySelector('#btn-new-folder')
    btnRename = document.querySelector('#btn-rename')
    btnDelete = document.querySelector('#btn-delete')
    
    constructor(){

        this.btnRename.style.display = 'none'
        this.btnDelete.style.display = 'none'
    }

//renderizam no front-end o progresso da barra de upload dos arquivos
    modalShow(show = true){

        this.snackModalEl.getElementsByClassName.display = (show)? "block":"none"

    }

    uploadComplete(){

        this.modalShow(false)
        this.inputFilesEl.value = ''
        this.btnSendFileEl.disabled = false

    }

    uploadProgress(obj){

        this.progressBarEl.getElementsByClassName.width = `${obj.porcent}`
        this.nameFileEl.innerHTML = obj.filename
        this.timeleftEl.innerHTML = this.formatTimeToHuman(obj.timeleft)
    
    }

    formatTimeToHuman(duration){

        const seconds = FormatTime.timestampToSeconds(duration)
        const minutes = FormatTime.timestampToMinutes(duration)
        const hours = FormatTime.timestampToHours(duration)

        if(hours > 0) return `${hours} horas, ${minutes} e ${seconds}`

        if(minutes > 0) return `${minutes} minutos e ${seconds}`

        if(seconds > 0) return `${seconds} segundos`

        return ``

    }

//renderizam no front-end a representação dos arquivos registrados no realtime database

    getFilesIconView(file){

        switch(file.mimetype){
            case 'folder':
                return SvgView.getHTMLFolder()
                break
            case 'application/pdf':
                return SvgView.getHTMLPdf()
                break
            case 'audio/mp3':
            case 'audio/ogg':
                return SvgView.getHTMLAudio()
                break
            case 'video/mp4':
            case 'video/quicktime':
                return SvgView.getHTMLVideo()
                break
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
                return SvgView.getHTMLImage()
                break
            default:
                return SvgView.getHTMLUnknown()
                break
        }

    }

    getFileView(file, key){

        const li = document.createElement('li')

        li.dataset.key = key
        li.dataset.file = JSON.stringify(file)

        li.innerHTML = `
            ${this.getFilesIconView(file)}
            <div class="name text-center">${file.originalFilename}
            </div>
        ` 

        this.initEventsLi(li)

        return li

    }

    clearListOfFilesAndDiretories(){
        this.listFilesEl.innerHTML = ''
    }



    readFiles(file, key){

        this.listFilesEl.appendChild(this.getFileView(file, key))
    }

//Eventos DOM relacionados à aplicação de estilo ao click das <li> que representam os arquivos na máquina e database do firebase

    initEventsLi(li){



        li.addEventListener('click', e=>{

            
            if(e.shiftKey) {
                
                let firstLi = this.listFilesEl.querySelector('.selected')

                if(firstLi) {
                    
                    let indexStart
                    let indexEnd

                    const lis = [...li.parentElement.childNodes]
                    
                    lis.forEach((el, i) => {
                        
                        if(el === firstLi) indexStart = i
                        
                        if(li === el) indexEnd = i
                        
                        
                    })
                    
                    let index = [indexStart, indexEnd].sort()
                    
                    lis.forEach((el, i) => {
                        
                        if(i >= index[0] && i <= index[1]) el.classList.add('selected')
                        
                    })
                    
                    this.listFilesEl.dispatchEvent(this.onSelectionChange)

                    return
                }

            }

            if(!e.ctrlKey) this.listFilesEl.querySelectorAll("li.selected").forEach( el =>{

                    el.classList.remove('selected')

                })

            li.classList.toggle('selected')
            
            this.listFilesEl.dispatchEvent(this.onSelectionChange)
        })

    }
    
    getSelection(){
        return this.listFilesEl.querySelectorAll('.selected')
    }

//Eventos DOM organização

    showMenuOrgOptions(){
        
        switch(this.getSelection().length){
        
            case 0:
                this.btnDelete.style.display = 'none'
                this.btnRename.style.display = 'none'
                break
            case 1:
                this.btnDelete.style.display = 'block'
                this.btnRename.style.display = "block"
                break
            default:
                this.btnRename.style.display = "none"
                this.btnDelete.style.display = "block"
                break
        
        }

    }

}

export const dropboxView = new DropboxView()