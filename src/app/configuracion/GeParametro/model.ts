import {GeGenericDto} from '../../common/generic.model'
import {GeGrupoParametroDto} from '../../configuracion/GeGrupoParametro/model'
import {SeUsuarioDto} from '../../seguridad/SeUsuario/model'

export class GeParametroDto extends GeGenericDto{
    //M001-RCHANG-20161201-Se crea clase GeParametroDto para que contengas las variables de un parametro
    
    public clave:string;
    public descripcion:string;
    public tipoDato:string;
    public tipoDatoDesc:string;
    public valor:string;
    public indDefecto:boolean;
    public indDefectoDesc:string;
    public descripcionCorta:string;
    public codHomologacion:string;
    public codEstandar:string;
    public estado:boolean;
    public estadoDesc:string;
    public grupoDto:GeGrupoParametroDto;

}
