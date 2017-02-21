import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {GeErrorDto, GeMensajeHttpDto} from '../../app/generic/error/error.model';
import { AppConfiguration } from './app.configuration';
import { GeGenericConst } from './generic.const';
import { GeFiltroDto } from './generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {AuthService} from "../seguridad/auth.service";


export class GeBaseService {
    //M001-RCHANG-20161201-Se crea clase GeBaseService para mantener siempres variables y metodos genéricos en los servicios

    public serviceName: string;
    public headers: Headers;
    public headersSecurity: Headers;
    public url: string;
    public urlSecurity: string;
    public opts: RequestOptionsArgs;
    public optsSecurity: RequestOptionsArgs;
    public http: Http;
    public configuration: AppConfiguration;
    public geGenericConst: GeGenericConst;


    constructor(serviceName: string, urlEntidad: string, http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        this.configuration = configuration;
        this.http = http;
        this.serviceName = serviceName;
        this.geGenericConst = geGenericConst;

        this.url = this.configuration.baseUrl + urlEntidad;
        this.headers = this.configuration.headers;
        this.opts = { headers: this.headers }

        this.urlSecurity = this.configuration.baseUrlSecurity;
        this.headersSecurity = this.configuration.headersSecurity;
        this.optsSecurity = { headers: this.headersSecurity };
    }
    public gets = (filtro: GeFiltroDto): Observable<any> => {
        //console.log(JSON.stringify(filtro))
        let opts: RequestOptionsArgs;

        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        /*if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }*/
        headersSecurity.append('Authorization', 'Bearer ' + token)

        opts = { headers: headersSecurity };

        let params: URLSearchParams = new URLSearchParams();
        params.set("filtro", JSON.stringify(filtro));

        opts.search = params;

        return this.http.get(this.url + "gets", opts).map(this.cargarData).catch(this.cargarError);

    }

    //Servicio para obtener un dto de la entidad representada por su ID
    public get = (id: number): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        /*if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }*/
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "getsId/" + id, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

    //Servicio para guardar la entidad
    public save = (dto: any): Observable<any> => {
        //console.log(JSON.stringify(dto))
        let headersSecurity: Headers = this.headers;
        let token: string = this.getTokenSession();
        /*let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }*/
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.post(this.url + "save", dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    //Servicio para actualizar una nueva entidad en la base de datos
    public update = (dto: any): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        /*let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }*/
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.put(this.url + "save/" + dto.id, dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    //Servicio para eliminar una nueva entidad en la base de datos
    public delete = (dto: any): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        /*let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }*/
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.post(this.url + "save", dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }


    //Metodo que agrega los datos de auditoria a los FormCroup
    public addGenericValuesConstrols(anyForm: FormGroup, dto: any){
        anyForm.controls["id"].setValue(dto.id);
        anyForm.controls["fecha"].setValue(dto.fecha);
        anyForm.controls["terminal"].setValue(dto.terminal);
        anyForm.controls["usuarioDto"].setValue(dto.usuarioDto);
        anyForm.controls["fechaCreacion"].setValue(dto.fechaCreacion);
        anyForm.controls["terminalCreacion"].setValue(dto.terminalCreacion);
        anyForm.controls["usuarioCreacionDto"].setValue(dto.usuarioCreacionDto);
    }

    public addGenericValuesConstrolsNoObj(anyForm: FormGroup, dto: any){
        anyForm.controls["id"].setValue(dto.id);
        anyForm.controls["fecha"].setValue(dto.fecha);
        anyForm.controls["terminal"].setValue(dto.terminal);
        anyForm.controls["usuario"].setValue(dto.usuario);
        anyForm.controls["fechaCreacion"].setValue(dto.fechaCreacion);
        anyForm.controls["terminalCreacion"].setValue(dto.terminalCreacion);
        anyForm.controls["usuarioCreacion"].setValue(dto.usuarioCreacion);
    }

    public log(p: any) {
        console.log(p);

    }

    public cargarData(res: Response): any {
        let rpta : any = res.json();

        if(rpta){
            if (rpta.codigoGrupoHttp == '2XX') {
                let rptaDto: GeMensajeHttpDto = new GeMensajeHttpDto(rpta.codigoHttp,rpta.codigoGrupoHttp,rpta.nombreGrupoHttp,rpta.resumenHttp, rpta.mensajeSistemaHttp,rpta.mensajeUsuario);
                rptaDto.detalle = rpta.detalle;
                rptaDto.respuesta = rpta.respuesta;
                //return Observable.create(rptaDto);
                return rptaDto;
            }else {
                let errorDto: GeMensajeHttpDto = new GeMensajeHttpDto(rpta.codigoHttp,rpta.codigoGrupoHttp,rpta.nombreGrupoHttp,rpta.resumenHttp, rpta.mensajeSistemaHttp,rpta.mensajeUsuario);
                errorDto.detalle = rpta.detalle;

                return Observable.throw(errorDto);
            }
        }
    }


    public cargarError(error: Response | any): Observable<any> {
        //console.log('cargarError')
        //console.log(error)
        // In a real world app, we might use a remote logging infrastructure
        if (error instanceof Response) {

            let rpta : any = error.json();
            let errorDto: GeMensajeHttpDto
            if (rpta.error=='invalid_token') {
                 errorDto = new GeMensajeHttpDto(error.status,"","","Error de Seguridad", rpta.error,"Su acceso ha caducado y/o ya no se encuentra activa; por favor intente logeandose al sistema nuevamente!");
                 errorDto.detalle = rpta.error_description;
            }else {
                errorDto = new GeMensajeHttpDto(error.status,"","","Error no identificado", "Es probable que el servidor de recursos y/o de seguridad no esté activo","Ha ocurrido un error no identificado; por favor comuniquese con el Área de Sistemas");

            }
            return Observable.throw(errorDto);
        }else{
            let errMsg: string;
            errMsg = error.message ? error.message : error.toString();
            return Observable.throw(new GeMensajeHttpDto(0,'Otro',"Error no identificado","Error no identificado", errMsg,errMsg));
        }

    }

    getTokenSession() : string {
        let token: string = null;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        //headersSecurity.append('Authorization', 'Bearer ' + token)
        return token;
    }

}