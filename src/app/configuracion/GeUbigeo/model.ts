import {GeGenericDto} from '../../common/generic.model'

export class GeUbigeoDto extends GeGenericDto{
    public id:number;
    public nombre:string;
    public nombreCorto:string;
    public tipo:string;
    public codPostal:string;
    public codInei:string;
    public codSunat:string;
    public estado:boolean;
    public padreDto:GeUbigeoDto;
}