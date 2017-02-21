import {GeGenericDto} from '../../common/generic.model'
import {SeUsuarioDto} from '../../seguridad/SeUsuario/model'

export class GeGrupoParametroDto extends GeGenericDto{
    public id:number;
    public tipo:string;
    public tipoDesc:string;
    public nombre:string;

    
}
