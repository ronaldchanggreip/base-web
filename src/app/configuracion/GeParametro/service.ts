
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeParametroDto } from './model'
import { GeGrupoParametroDto } from '../GeGrupoParametro/model'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroDetaDto,GeFiltroOrderDto } from '../../common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Injectable()
export class GeParametroService extends GeBaseService {
    //M001-RCHANG-20161201-Se crea clase GeParametroService administrar los servicios de parametro

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeParametroService', 'parametro/', http, configuration, geGenericConst);
    }

    public getSitParametroPorGrupo(grupo: number, tipo: number): SelectItem[] {
        var sitParametroPorGrupo: SelectItem[] = [];

        if (tipo == 1) { //Para un formulario
            sitParametroPorGrupo.push({ label: this.getSeleccionar().descripcion, value: this.getSeleccionar() });
        } else if (tipo == 2) { //Para busqueda
            sitParametroPorGrupo.push({ label: this.getNinguno().descripcion, value: this.getNinguno()});
        }
      
        let f:GeFiltroDto = new GeFiltroDto();
        f.order = true;
        f.orders.push(new GeFiltroOrderDto('descripcion',this.geGenericConst.ordAsc));
        f.filtros.push(new GeFiltroDetaDto('grupoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,grupo+''));
        this.gets(f)
            .subscribe((response: GeMensajeHttpDto) => {
                if(response.respuesta!=null){
                    for (let dto of response.respuesta) {
                        sitParametroPorGrupo.push({ label: dto.descripcion, value: dto });
                    }
                }
            },

            error => console.log(error)
            );
        return sitParametroPorGrupo;
    }

    public getNinguno():GeParametroDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.descripcion = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():GeParametroDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.descripcion = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    //Servicio para crear un nuevo objeto
    public newObject(): GeParametroDto {
        let dto: GeParametroDto = new GeParametroDto();
        dto.grupoDto = new GeGrupoParametroDto();
        dto.estado = true;
        dto.indDefecto = false;
        return dto;
    }

    public addValuesControls(anyForm: FormGroup, dto: GeParametroDto){
        anyForm.controls["clave"].setValue(dto.clave);
        anyForm.controls["descripcion"].setValue(dto.descripcion);
        anyForm.controls["tipoDato"].setValue(dto.tipoDato);
        anyForm.controls["valor"].setValue(dto.valor);
        anyForm.controls["indDefecto"].setValue(dto.indDefecto);
        anyForm.controls["descripcionCorta"].setValue(dto.descripcionCorta);
        anyForm.controls["codHomologacion"].setValue(dto.codHomologacion);
        anyForm.controls["codEstandar"].setValue(dto.codEstandar);
        anyForm.controls["grupoDto"].setValue(dto.grupoDto);
        anyForm.controls["estado"].setValue(dto.estado);
        this.addGenericValuesConstrols(anyForm, dto);
    }
}