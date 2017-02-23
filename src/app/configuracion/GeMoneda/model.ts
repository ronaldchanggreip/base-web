import {GeGenericDto} from '../../common/generic.model'
import {GeUbigeoDto} from '../GeUbigeo/model'

export class GeMonedaDto extends GeGenericDto{
    public id:number;
    public nombre:string;
    public nombreCorto:string;
    public nombreTrx:string;
    public simbolo:string;
    public estado:boolean = false;
    public paisDto:GeUbigeoDto;
}