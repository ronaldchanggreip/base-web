import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { ExCuentaEmpresaDto } from './model';
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto, GeFiltroDetaDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { GeMensajeHttpDto } from '../../generic/error/error.model'

@Injectable()
export class ExCuentaEmpresaService extends GeBaseService{
    //M001-HVIVES-20170119-Se crea clase ExCuentaEmpresaService administrar los servicios de cuenta empresa

    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst) {
        super('ExCuentaEmpresaService', 'cuenta-empresa/', http, configuration, geGenericConst);
    }

    public addValuesControls(anyForm: FormGroup, dto: ExCuentaEmpresaDto){
        anyForm.controls["bancoDto"].setValue(dto.bancoDto);
        anyForm.controls["monedaDto"].setValue(dto.monedaDto);
        anyForm.controls["cuenta"].setValue(dto.cuenta);
        anyForm.controls["cuentaInter"].setValue(dto.cuentaInter);
        anyForm.controls["saldo"].setValue(dto.saldo);
        anyForm.controls["estado"].setValue(dto.estado);
        this.addGenericValuesConstrols(anyForm, dto);
    }

    public getCuentaEmpresa(banco: number, moneda: number, control: any): SelectItem[] {
        var sitCuentEmpresa: SelectItem[] = [];
        //Armamos el filtro
        var filtro: GeFiltroDto = new GeFiltroDto();

        filtro.filtros.push(new GeFiltroDetaDto('bancoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,banco+''));
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
                        sitCuentEmpresa.push({ label: dto.cuenta + "(CI: " + dto.cuentaInter + ")", value: dto });
                        cont ++;
                    }
                }
            },

            error => console.log(error)
            );
        return sitCuentEmpresa;
    }

    public getCuentaEmpresa2(moneda: number, control: any): SelectItem[] {
        var sitCuentEmpresa: SelectItem[] = [];
        //Armamos el filtro
        var filtro: GeFiltroDto = new GeFiltroDto();

        filtro.filtros.push(new GeFiltroDetaDto('monedaDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,moneda+''));
        filtro.order = false;
        this.gets(filtro)
            .subscribe((response: GeMensajeHttpDto) => {
                    if(response.respuesta!=null){
                        var cont = 0;
                        control.setValue(null);
                        for (let dto of response.respuesta) {
                            if(cont == 0)
                                control.setValue(dto);
                            sitCuentEmpresa.push({ label: dto.cuenta + " - (CI: " + dto.cuentaInter + ")", value: dto });
                            cont ++;
                        }
                    }
                },

                error => console.log(error)
            );
        return sitCuentEmpresa;
    }
}