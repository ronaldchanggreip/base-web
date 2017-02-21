import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {GeErrorDto, GeMensajeHttpDto} from '../../app/generic/error/error.model';
import { AppConfiguration } from './app.configuration';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeSocioNegocioDto } from '../configuracion/GeSocioNegocio/model'
import { AuthService } from '../seguridad/auth.service'


export class GeBaseComponent {
    //M001-RCHANG-20161201-Se crea clase GeBaseComponent para mantener siempres variables y metodos genéricos en los componentes.

    private componentName: string = 'Client Web Greip';
    public configuration: AppConfiguration;
    public router: Router;
    public formatFechaHora: string = "'" + 'dd/MM/yyyy hh:mm:ss' + "'";

    public displayBitaDialog: boolean = false;
    public dtoError: GeMensajeHttpDto;
    //public geMensajeHttpDto:GeMensajeHttpDto;
    public displayDialogError: boolean = false;
    public auth:AuthService;
    public widthDialog:number;

    constructor(componentName: string, router: Router, configuration: AppConfiguration, auth:AuthService) {
        this.componentName = componentName;
        this.configuration = configuration;
        this.router = router;
        this.auth = auth;

        this.validarToken("T",sessionStorage.getItem("access_token"));
        this.validarToken("R",sessionStorage.getItem("access_token_r"));
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;


        //auth.checkToken(sessionStorage.getItem("access_token"));
    }

    private validarToken (tipo:string,token:string) {
        //console.log("entra validarToken")
        if (token!=null) {
            this.auth.checkToken(token).subscribe(
                res => {
                    if (res==false) {
                        if (tipo=="T") {
                            if (sessionStorage.getItem("access_token_r")==null) {//Si aun no hay refresh token
                                this.refreshToken();
                            }else {
                                this.auth.logout();
                            }
                        }else {
                            this.auth.logout();
                        }
                    }
                },
                err => {
                    if (tipo=="T") {
                        if (sessionStorage.getItem("access_token_r")==null) {
                            this.refreshToken();
                        }else {
                            this.auth.logout();
                        }
                    }else {
                        this.auth.logout();
                    }

                }
            )
        }

    }

    private refreshToken():boolean {
        let exTokenString:string = sessionStorage.getItem("oauth_token");
        if (exTokenString!=null) {
            let exToken = JSON.parse(exTokenString);
            this.auth.refreshToken(exToken.refresh_token).subscribe(res=>
            {
                //console.log(res.access_token);
                //console.log(res);
                sessionStorage.setItem('access_token_r',res.access_token);
                sessionStorage.setItem('oauth_token_r',JSON.stringify(res));
                return true;

                //console.log('llega al router')
                //this.router.navigate(['/home']);
            },(err =>
            {
                return false;
            }),()=>{

            })
        }else {

            return false;
        }


    }

    //Metodo publico para llenar la variable publica dtoError
  /*  public handleError(error: Response) {
        this.dtoError = new GeErrorDto();
        this.dtoError.codigo = error.status;
        this.dtoError.desErrorSistema = error.statusText;
        this.dtoError.capa = "Exchange Capa Web - " || this.componentName;
        //return Observable.throw(geErrorDto);
    }*/

    //Metodo publico para imprimir log en consola
    public log(v: any) {
        console.log(v);
    }

    //Metodo publico para capturar la respuesta de error de un componente hijo (Modal)
    public respuestaError(event) {
        this.displayDialogError = false;
        this.dtoError = null;

    }

    //Metodo publico para mostrar el modal de error
    public mostrarError(error: GeMensajeHttpDto) {
        //console.log(this.dtoError)
        this.dtoError= error;
        /*this.dtoError = new GeErrorDto();
        this.dtoError.codigo = error.codigoHttp;
        this.dtoError.desErrorSistema = error.mensajeSistemaHttp;
        this.dtoError.desErrorUsuario = error.mensajeUsuario;
        this.dtoError.desError = error.resumenHttp;
        */
        this.displayDialogError = true;
    }

    /** Capturamos la respuesta del hijo (bitacora)*/
    public respuestaBitacora(event) {
        this.displayBitaDialog = false;
        console.log("en la respuesta de la bitacora: ", this.displayBitaDialog);
    }

    public addGenericControls(anyForm: FormGroup){
        anyForm.addControl("id", new FormControl('', Validators.nullValidator));
        anyForm.addControl("fecha", new FormControl('', Validators.nullValidator));
        anyForm.addControl("terminal", new FormControl('', Validators.nullValidator));
        anyForm.addControl("usuarioDto", new FormControl('', Validators.nullValidator));
        anyForm.addControl("fechaCreacion", new FormControl('', Validators.nullValidator));
        anyForm.addControl("terminalCreacion", new FormControl('', Validators.nullValidator));
        anyForm.addControl("usuarioCreacionDto", new FormControl('', Validators.nullValidator));
    }

    public addGenericControlsNoObj(anyForm: FormGroup){
        anyForm.addControl("id", new FormControl('', Validators.nullValidator));
        anyForm.addControl("fecha", new FormControl('', Validators.nullValidator));
        anyForm.addControl("terminal", new FormControl('', Validators.nullValidator));
        anyForm.addControl("usuario", new FormControl('', Validators.nullValidator));
        anyForm.addControl("fechaCreacion", new FormControl('', Validators.nullValidator));
        anyForm.addControl("terminalCreacion", new FormControl('', Validators.nullValidator));
        anyForm.addControl("usuarioCreacion", new FormControl('', Validators.nullValidator));
    }
}