import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { ExSolicitudDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class ExSolicitudService extends GeBaseService{
    //M001-HVIVES-20170119-Se crea clase ExSolicitudService administrar los servicios de solicitud

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('ExSolicitudService', 'solicitud/', http, configuration, geGenericConst);
    }

    public addValuesControlsSocio(anyForm: FormGroup, dto: ExSolicitudDto){
        anyForm.controls["socioNegocioDto"].setValue(dto.socioNegocioDto);
        anyForm.controls["transaccion"].setValue(dto.transaccion);
        anyForm.controls["importeOrigen"].setValue(dto.importeOrigen);
        anyForm.controls["bancoOrigenDto"].setValue(dto.bancoOrigenDto);
        anyForm.controls["cEmpOrigenDto"].setValue(dto.cEmpOrigenDto);
        anyForm.controls["numVoucherOrigen"].setValue(dto.numVoucherOrigen);
        anyForm.controls["monedaOrigenDto"].setValue(dto.monedaOrigenDto);
        anyForm.controls["bancoDestinoDto"].setValue(dto.bancoDestinoDto);
        anyForm.controls["cBancariaDestinoDto"].setValue(dto.cBancariaDestinoDto);
        anyForm.controls["monedaDestinoDto"].setValue(dto.monedaDestinoDto);
        anyForm.controls["estado"].setValue(dto.estado);
        anyForm.controls["etapa"].setValue(dto.etapa);
        this.addGenericValuesConstrols(anyForm, dto);
    }

    public actualizarPorSocio = (dto: ExSolicitudDto): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.put(this.url + "actualizarPorSocio/" + dto.id, dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public actualizarPorExchange = (dto: ExSolicitudDto): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.put(this.url + "actualizarPorExchange/" + dto.id, dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public anular = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "anular", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public observarEnRevision = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "observarEnRevision", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public observarEnValidacion = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "observarEnValidacion", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public abortar = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "abortar", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public revisar = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "revisada", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public validar = (solicitudes: ExSolicitudDto[]): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.post(this.url + "validada", solicitudes, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public levantarObs = (solicitud: ExSolicitudDto): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.put(this.url + "levantarObservacion/" + solicitud.id, solicitud, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }

    public ejecutar = (solicitud: ExSolicitudDto): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.put(this.url + "ejecutada/" + solicitud.id, solicitud, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }
}