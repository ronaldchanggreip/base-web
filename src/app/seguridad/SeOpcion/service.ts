import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'

@Injectable()
export class SeOpcionService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        super('SeOpcionService', 'opcion/', http, configuration, geGenericConst);
    }

    public getArbolWeb = (): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.get(this.url + "getArbolWeb", { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }
}