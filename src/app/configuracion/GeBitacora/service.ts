import { Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import {GeBitacoraDto} from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Injectable()
export class GeBitacoraService extends GeBaseService{
    //M001-HVIVES-20170202-Se crea clase GeBitacoraService administrar los servicios de bitacora

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeBitacoraService', 'bitacora/', http, configuration, geGenericConst);
    }

    public newObject(): GeBitacoraDto {
        return new GeBitacoraDto();
    }
}