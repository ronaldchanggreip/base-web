import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeSocioNegocioDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto, GeFiltroDetaDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Injectable()
export class GeSocioNegocioService extends GeBaseService{
    //M001-HVIVES-20170112-Se crea clase ExTipoCambioService administrar los servicios de socio de negocio

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeSocioNegocioService', 'socio-negocio/', http, configuration, geGenericConst);
    }

    public addValuesControls(anyForm: FormGroup, dto: GeSocioNegocioDto){
        anyForm.controls["tipoDocumentoDto"].setValue(dto.tipoDocumentoDto);
        anyForm.controls["numDocumento"].setValue(dto.numDocumento);
        anyForm.controls["nombres"].setValue(dto.nombres);
        anyForm.controls["apPaterno"].setValue(dto.apPaterno);
        anyForm.controls["apMaterno"].setValue(dto.apMaterno);
        anyForm.controls["razSocial"].setValue(dto.razSocial);
        anyForm.controls["indCliente"].setValue(dto.indCliente);
        anyForm.controls["indProveedor"].setValue(dto.indProveedor);
        anyForm.controls["telefPrincipal"].setValue(dto.telefPrincipal);
        anyForm.controls["anexoPrincipal"].setValue(dto.anexoPrincipal);
        anyForm.controls["telefSecundario"].setValue(dto.telefSecundario);
        anyForm.controls["anexoSecundario"].setValue(dto.anexoSecundario);
        anyForm.controls["movilPrincipal"].setValue(dto.movilPrincipal);
        anyForm.controls["movilSecundario"].setValue(dto.movilSecundario);
        anyForm.controls["nacionalidadDto"].setValue(dto.nacionalidadDto);
        anyForm.controls["estado"].setValue(dto.estado);
        this.addGenericValuesConstrols(anyForm, dto);
    }

    public getSitSocioNegocio(tipo: number): SelectItem[] {
        var sitSocioNegocio: SelectItem[] = [];

        if (tipo == 1) { //Para un formulario
            sitSocioNegocio.push({ label: this.getSeleccionar().descripcion, value: this.getSeleccionar() });
        } else if (tipo == 2) { //Para busqueda
            sitSocioNegocio.push({ label: this.getNinguno().descripcion, value: this.getNinguno()});
        }

        let f:GeFiltroDto = new GeFiltroDto();
        f.order = true;
        f.orders.push(new GeFiltroOrderDto('nombreCompleto',this.geGenericConst.ordAsc));
        f.filtros.push(new GeFiltroDetaDto('indCliente',this.geGenericConst.opeEq,this.geGenericConst.tdBoolean.codigo,'true'));
        this.gets(f)
            .subscribe((response: GeMensajeHttpDto) => {
                    if(response.respuesta!=null){
                        for (let dto of response.respuesta) {
                            sitSocioNegocio.push({ label: dto.nombreCompleto, value: dto });
                        }
                    }
                },

                error => console.log(error)
            );
        return sitSocioNegocio;
    }

    public getsByDocumento = (tipo: number, numero: string): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.get(this.url + "getsByDocumento/" + tipo + "/" + numero, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

    public getNinguno():GeSocioNegocioDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.descripcion = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():GeSocioNegocioDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.descripcion = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }
    public newObject(): GeSocioNegocioDto {
        let dto: GeSocioNegocioDto = new GeSocioNegocioDto();
        return dto;
    }

    public getUsuario = (usuario: number): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.get(this.url + "getsUsuario/" + usuario, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }
}