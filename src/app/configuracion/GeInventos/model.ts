

export class GeInventoDto {
    public id:number;    
    public nombre:string;

    constructor(id:number,nombre:string) {

    }
}

export class GeInventoArbolDto {
    public id:number;    
    public nombre:string;
    public padre:GeInventoArbolDto;

    constructor(id:number,nombre:string,padre:GeInventoArbolDto) {
        
    }
}
