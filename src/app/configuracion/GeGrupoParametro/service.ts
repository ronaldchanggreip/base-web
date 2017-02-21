
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeGrupoParametroDto } from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Injectable()
export class GeGrupoParametroService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        super('GeGrupoParametroService', 'grupo/', http, configuration, geGenericConst);
    }

    public newObject(): GeGrupoParametroDto {
        return new GeGrupoParametroDto();
    }

    /**Retorna una lista de SelecItem 
     * Tipo: es el tipo para la que se va necesitar 1:Si es un Formulario y 2: Si es para busqueda
    */
    public getSitTipoGrupoParametro(tipo: number): SelectItem[] {

        var sitTiposGrupoParametro: SelectItem[] = [];

        if (tipo == 1) { //Para un formulario
            sitTiposGrupoParametro.push({ label: this.getSeleccionar().nombre, value: this.getSeleccionar() });
        } else if (tipo == 2) { //Para busqueda
            sitTiposGrupoParametro.push({ label: this.getSeleccionar().nombre, value: this.getNinguno });
        }
      
        let f:GeFiltroDto = new GeFiltroDto();
        f.order = true;
        f.orders.push(new GeFiltroOrderDto('nombre',this.geGenericConst.ordAsc));
        this.gets(f)
            .subscribe((response: GeMensajeHttpDto) => {
                let rptaDto:GeGrupoParametroDto[] = response.respuesta;
                for (let dto of rptaDto) {
                    sitTiposGrupoParametro.push({ label: dto.nombre, value: dto });
                }
            },

            error => console.log(error)
            );


        return sitTiposGrupoParametro;

    }

    public getNinguno():GeGrupoParametroDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.tipo = 'S';
        dto.nombre = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():GeGrupoParametroDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.tipo = 'S';
        dto.nombre = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    public addValuesControls(anyForm: FormGroup, dto: GeGrupoParametroDto){
        anyForm.controls["tipo"].setValue(dto.tipo);
        anyForm.controls["nombre"].setValue(dto.nombre);
        this.addGenericValuesConstrols(anyForm, dto);
    }
}