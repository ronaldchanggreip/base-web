
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeErrorHttpDto, GeErrorDto } from './error.model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'

@Injectable()
export class GeErrorService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        super('GeErrorService', 'generic/', http, configuration, geGenericConst);
    }


    public gets = (): Observable<GeErrorHttpDto[]> => {
        return this.http.get('erroresHttp.json').map(this.cargarData).catch(this.cargarError);
    }

    


}