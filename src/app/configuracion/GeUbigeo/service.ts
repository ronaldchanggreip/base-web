
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeUbigeoDto } from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class GeUbigeoService extends GeBaseService{
    //M001-HVIVES-20170112-Se crea clase GeUbigeoService administrar los servicios de ubigeo

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeUbigeoService', 'ubigeo/', http, configuration, geGenericConst);
    }

    public getDefaultUbigeoCtrl(control: any) {
        this.get(this.geGenericConst.codUbigeoDefault)
            .subscribe(
                (response: GeMensajeHttpDto) => { control.setValue(response.respuesta);},
                error => {

                }
            );
        return null;
    }

    public getSitUbigeo(tipo: number): SelectItem[] {
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
                let rptaDtos: GeUbigeoDto[] = response.respuesta;
                for (let dto of rptaDtos) {
                    sitUbigeo.push({ label: dto.nombre, value: dto });
                }
            },

            error => console.log(error)
            );


        return sitUbigeo;
    }

    public getNinguno():GeUbigeoDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.nombre = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():GeUbigeoDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.nombre = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    public newObject(): GeUbigeoDto {
        return new GeUbigeoDto();
    }
}
