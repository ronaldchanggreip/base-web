import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeSocioNegocioCuentaDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto, GeFiltroDetaDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { GeMensajeHttpDto } from '../../generic/error/error.model'


@Injectable()
export class GeSocioNegocioCuentaService extends GeBaseService{
    //M001-HVIVES-20170112-Se crea clase GeSocioNegocioCuentaService administrar los servicios de socio de negocio cuenta

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('GeSocioNegocioCuentaService', 'socio-negocio-cuenta/', http, configuration, geGenericConst);
    }

    public addValuesControls(anyForm: FormGroup, dto: GeSocioNegocioCuentaDto){
        anyForm.controls["id"].setValue(dto.id);
        anyForm.controls["bancoDto"].setValue(dto.bancoDto);
        anyForm.controls["monedaDto"].setValue(dto.monedaDto);
        anyForm.controls["numCuenta"].setValue(dto.numCuenta);
        anyForm.controls["numCuentaCII"].setValue(dto.numCuentaCII);
        anyForm.controls["estado"].setValue(dto.estado);
    }

    public getSocioNegocioCuenta(socio: number, banco: number, moneda: number, control: any): SelectItem[] {
        var sitCuentEmpresa: SelectItem[] = [];
        var filtro: GeFiltroDto = new GeFiltroDto();

        filtro.filtros.push(new GeFiltroDetaDto('socioNegocioDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,socio+''));
        filtro.filtros.push(new GeFiltroDetaDto('bancoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,banco+''));
        filtro.filtros.push(new GeFiltroDetaDto('monedaDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,moneda+''));
        filtro.filtros.push(new GeFiltroDetaDto('monedaDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,moneda+''));
        filtro.filtros.push(new GeFiltroDetaDto('estado',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,'A'));
        filtro.order = false;

        this.gets(filtro)
            .subscribe((response: GeMensajeHttpDto) => {
                if(response.respuesta!=null){
                    var cont = 0;
                    control.setValue(null);
                    for (let dto of response.respuesta) {
                        if(cont == 0)
                            control.setValue(dto);
                        sitCuentEmpresa.push({ label: dto.numCuenta + " - (CI: " + dto.numCuentaCII + ")", value: dto });
                        cont ++;
                    }
                }
            },

            error => console.log(error)
            );
        return sitCuentEmpresa;
    }
}