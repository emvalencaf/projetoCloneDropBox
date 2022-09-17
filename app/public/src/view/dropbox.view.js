import { FormatTime } from "../utils/formatTime.utils.js"
import { SvgView } from "./svg.view.js"

class DropboxView{

    btnSendFileEl = document.querySelector('#btn-send-file')
    inputFilesEl = document.querySelector('#files')
    snackModalEl = document.querySelector('#react-snackbar-root')
    progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg")
    nameFileEl = this.snackModalEl.querySelector(".filename")
    timeleftEl = this.snackModalEl.querySelector('.timeleft')

    modalShow(show = true){

        this.snackModalEl.getElementsByClassName.display = (show)? "block":"none"

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

    getFilesIconView(file){

        switch(file.type){
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

    getFileView(file){

        return `
            ${this.getFileIconView(file)}
            <div class="name text-center">${file.name}
            </div>
        ` 

    }

}

export const dropboxView = new DropboxView()