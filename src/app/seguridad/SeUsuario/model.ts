import {SeRolDto} from "../SeRol/model";
import {GeParametroDto} from "../../configuracion/GeParametro/model";

export class SeUsuarioDto {
    public id:number;
    public login:string;
    public nombre:string;
    public email:string;
    public contrasena: string;
    public rolDto: SeRolDto;
    public fecVigencia:Date;
    public indBloqueado:boolean;
    public estado:boolean;
    public confCantReg:number;
    public confIdioma:string;
    public socioNegocio: number;

    public tipoDocumentoDto: GeParametroDto;
    public numDocumento: string;
    public nombres: string;
    public apPaterno: string;
    public apMaterno: string;
    public razSocial: string;

    public cambiarPassword: boolean;
    public confirmContrasena: string;
    public confirmEmail: string;
    public eliminado: boolean;
}
