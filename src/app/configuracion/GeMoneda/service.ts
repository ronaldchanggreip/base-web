import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeMonedaDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Injectable()
export class GeMonedaService extends GeBaseService{
    //M001-HVIVES-20170112-Se crea clase GeMonedaService administrar los servicios de moneda

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeMonedaService', 'moneda/', http, configuration, geGenericConst);
    }

    //Servicio que sirve para llenar un combo tanto para filtro como para formulario
    public getSitMoneda(tipo: number): SelectItem[] {

        var sitUbigeo: SelectItem[] = [];

        if (tipo == 1) { //Para un formulario
            sitUbigeo.push({ label: this.getSeleccionar().nombre, value: this.getSeleccionar() });
        } else if (tipo == 2) { //Para busqueda
            sitUbigeo.push({ label: this.getNinguno().nombre, value: this.getNinguno() });
        }
      
        let f:GeFiltroDto = new GeFiltroDto();
        f.order = true;
        f.orders.push(new GeFiltroOrderDto('nombre',this.geGenericConst.ordAsc));
        this.gets(f)
            .subscribe((response: GeMensajeHttpDto) => {
                for (let dto of response.respuesta) {
                    sitUbigeo.push({ label: dto.nombre, value: dto });
                }
            },

            error => console.log(error)
            );


        return sitUbigeo;
    }

    public getNinguno():GeMonedaDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.nombre = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():GeMonedaDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.nombre = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    public newObject(): GeMonedaDto {
        return new GeMonedaDto();
    }

    public addValuesControls(anyForm: FormGroup, dto: GeMonedaDto){
        anyForm.controls["nombre"].setValue(dto.nombre);
        anyForm.controls["nombreCorto"].setValue(dto.nombreCorto);
        anyForm.controls["nombreTrx"].setValue(dto.nombreTrx);
        anyForm.controls["simbolo"].setValue(dto.simbolo);
        anyForm.controls["paisDto"].setValue(dto.paisDto);
        anyForm.controls["estado"].setValue(dto.estado);
        this.addGenericValuesConstrols(anyForm, dto);
    }
}