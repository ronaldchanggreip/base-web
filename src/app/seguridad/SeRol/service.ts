
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { SeRolDto } from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto, GeFiltroDetaDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { GeMensajeHttpDto } from '../../generic/error/error.model'

@Injectable()
export class SeRolService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        super('SeRolService', 'rol/', http, configuration, geGenericConst);
    }

    public newObject(): SeRolDto {
        return new SeRolDto();
    }

    public addValuesControls(anyForm: FormGroup, dto: SeRolDto){
        anyForm.controls["nombre"].setValue(dto.nombre);
        anyForm.controls["indAdministrador"].setValue(dto.indAdministrador);
        anyForm.controls["indSys"].setValue(dto.indSys);
        anyForm.controls["estado"].setValue(dto.estado);

        this.addGenericValuesConstrolsNoObj(anyForm, dto);
    }

    public getNinguno():SeRolDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.nombre = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():SeRolDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.nombre = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    public getSitRol(tipo: number): SelectItem[] {
        var sitRol: SelectItem[] = [];

        if (tipo == 1) { //Para un formulario
            sitRol.push({ label: this.getSeleccionar().nombre, value: this.getSeleccionar() });
        } else if (tipo == 2) { //Para busqueda
            sitRol.push({ label: this.getNinguno().nombre, value: this.getNinguno() });
        }

        let f:GeFiltroDto = new GeFiltroDto();
        f.filtros.push(new GeFiltroDetaDto('estado', this.geGenericConst.opeEq, this.geGenericConst.tdCaracter.codigo, 'A'));
        f.order = true;
        f.orders.push(new GeFiltroOrderDto('nombre',this.geGenericConst.ordAsc));
        this.gets(f)
            .subscribe((response: GeMensajeHttpDto) => {
                    let rptaDtos: SeRolDto[] = response.respuesta;
                    for (let dto of rptaDtos) {
                        sitRol.push({ label: dto.nombre, value: dto });
                    }
                },

                error => console.log(error)
            );
        return sitRol;
    }
}