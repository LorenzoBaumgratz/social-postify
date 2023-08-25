export class Publication {
    private midiaId:number
    private postId:number
    private date:Date

    constructor(midiaId:number,postId:number,date:Date){
        this.midiaId=midiaId;
        this.postId=postId;
        this.date=date;
    }
}
