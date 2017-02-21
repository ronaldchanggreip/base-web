export class GeErrorDto {
    public codigo:number; //Codigo de Error
    public desErrorUsuario:string; //Error a mostrar para el usuario
    public desErrorSistema:string; // Error a mostrar para Sistemas
    public desError:string; // Error en Json para Sistemas
    public capa:string; // Capa en la que se presenta el error

    public codigoHttp:number; //Codigo de Error http
    public codigoGrupoHttp:string;
    public nombreGrupoHttp:string;
    public resumenHttp:string;
    public mensajeSistemaHttp:string;
    public mensajeUsuario:string;
    public detalle: string;
} 

export class GeMensajeHttpDto {
    public codigoHttp:number; //Codigo de Error http
    public codigoGrupoHttp:string; 
    public nombreGrupoHttp:string; 
    public resumenHttp:string; 
    public mensajeSistemaHttp:string; 
    public mensajeUsuario:string;
    public detalle: string;
    public respuesta: any;

    constructor(codigoHttp:number,codigoGrupoHttp:string,nombreGrupoHttp:string,resumenHttp:string,mensajeSistemaHttp:string,mensajeUsuario:string){
        this.codigoHttp = codigoHttp;
        this.codigoGrupoHttp = codigoGrupoHttp;
        this.nombreGrupoHttp = nombreGrupoHttp;
        this.resumenHttp = resumenHttp;
        this.mensajeSistemaHttp = mensajeSistemaHttp;
        this.mensajeUsuario = mensajeUsuario;

    }
} 