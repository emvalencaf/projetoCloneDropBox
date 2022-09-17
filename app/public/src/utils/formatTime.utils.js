export class FormatTime{

    static timestampToSeconds(timestamp){

        return parseInt((timestamp / 1000) % 60)
    
    }

    static timestampToMinutes(timestamp){

        return parseInt((timestamp/ (1000 * 60)) % 60)

    }

    static timestampToHours(timestamp){

        return parseInt((timestamp/ (1000 * 60 * 60)) % 24)
    }

}