import { Injectable, OnInit } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import {GeBaseService} from "../../common/base.service";
import {GeArchivoDto} from "./model";

@Injectable()
export class GeArchivoService extends GeBaseService{

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst){
        super('GeArchivoService', 'archivo/', http, configuration, geGenericConst);
    }

    public getImage(id:number){
        var url:string = this.url + "download/" + id;
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }

        return Observable.create(observer=>{
            let req = new XMLHttpRequest();
            req.open('get',url);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.responseType = "arraybuffer";
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    console.log(req);
                    observer.next(req.response);
                    observer.complete();
                }
            };
            req.send();
        });
    }

    public modificar = (archivos: GeArchivoDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "modificarVarios", archivos, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public eliminar = (archivos: GeArchivoDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "eliminarVarios", archivos, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public newObject(): GeArchivoDto {
        return new GeArchivoDto();
    }
}