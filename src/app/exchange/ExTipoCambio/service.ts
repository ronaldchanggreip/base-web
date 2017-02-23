import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { ExTipoCambioDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto, GeFiltroDetaDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class ExTipoCambioService extends GeBaseService{
    //M001-HVIVES-20170112-Se crea clase ExTipoCambioService administrar los servicios de tipo de cambio

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('ExTipoCambioService', 'tipo-cambio/', http, configuration, geGenericConst);
    }

    public addValuesControls(anyForm: FormGroup, dto: ExTipoCambioDto){
        //anyForm.controls["tipo"].setValue(dto.tipo);
        anyForm.controls["bancoDto"].setValue(dto.bancoDto);
        anyForm.controls["monedaDestinoDto"].setValue(dto.monedaDestinoDto);
        anyForm.controls["monedaOrigenDto"].setValue(dto.monedaOrigenDto);
        //anyForm.controls["factor"].setValue(dto.factor);
        anyForm.controls["precioVenta"].setValue(dto.precioVenta);
        anyForm.controls["precioCompra"].setValue(dto.precioCompra);
        anyForm.controls["fechaVigencia"].setValue(new Date(dto.fechaVigencia));

        this.addGenericValuesConstrols(anyForm, dto);
    }

    public getTipoCambioVigente = (banco: number, monOrigen: number, monDestino: number): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "getTipoCambioVigente/" + banco + '/' + monOrigen + '/' + monDestino, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

    public getsPorFechaDolares= (fecha: Date): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "gets/" +fecha + "/"+this.geGenericConst.codMonedaDolar, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }
    public getsPorFechaEuros= (fecha: Date): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "gets/" +fecha + "/"+this.geGenericConst.codMonedaEuro, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }


    public getExchangeDolar= (fecha: Date): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "getTCExchange/" +fecha + "/"+this.geGenericConst.codMonedaDolar, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

    public getExchangeEuro= (fecha: Date): Observable<any> => {
        let headersSecurity: Headers = new Headers();

        let token: string = this.getTokenSession();
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "getTCExchange/" +fecha + "/"+this.geGenericConst.codMonedaEuro, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

}