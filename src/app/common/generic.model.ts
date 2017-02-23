import {SeUsuarioDto} from '../seguridad/SeUsuario/model'
export class GeListaDespegable {
    public codigo:string; //Codigo de Error
    public descripcion:string; //Error a mostrar para el usuario    
} 

export class GeGenericDto {
    //M001-RCHANG-20161201-Se crea clase GeGenericDto para que todos los Dtos extiendan de este.

    public id:number;
    public fecha:Date;
    public terminal:string;
    public usuarioDto:SeUsuarioDto;
    public comentario:string;
    public fechaCreacion:Date;
    public terminalCreacion:string;
    public usuarioCreacionDto:SeUsuarioDto;
    public eliminado: boolean;
}