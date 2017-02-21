
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { SeUsuarioDto } from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { GeBaseService } from '../../../app/common/base.service'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGenericConst } from '../../common/generic.const'
import { GeFiltroDto,GeFiltroOrderDto } from '../../../app/common/generic.model.filtro'
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class SeUsuarioService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration, geGenericConst: GeGenericConst) {
        super('SeUsuarioService', 'usuario/', http, configuration, geGenericConst);
    }

    public newObject(): SeUsuarioDto {
        return new SeUsuarioDto();
    }


    public getNinguno():SeUsuarioDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroNinguno.codigo;
        dto.nombre = this.geGenericConst.filtroNinguno.descripcion;
        return dto;
    }

    public getSeleccionar():SeUsuarioDto {
        let dto = this.newObject();
        dto.id = this.geGenericConst.filtroSeleccionar.codigo;
        dto.nombre = this.geGenericConst.filtroSeleccionar.descripcion;
        return dto;
    }

    public addValuesControls(anyForm: FormGroup, dto: SeUsuarioDto){
        anyForm.controls["nombre"].setValue(dto.nombre);
        anyForm.controls["login"].setValue(dto.login);
        anyForm.controls["email"].setValue(dto.email);
        anyForm.controls["rolDto"].setValue(dto.rolDto);
        anyForm.controls["contrasena"].setValue("");
        anyForm.controls["confirmContrasena"].setValue("");
        anyForm.controls["confirmEmail"].setValue("");
        anyForm.controls["indBloqueado"].setValue(dto.indBloqueado);
        anyForm.controls["estado"].setValue(dto.estado);
        console.log("TIPO DE DOCUMENTO : ", dto.tipoDocumentoDto);
        anyForm.controls["tipoDocumentoDto"].setValue(dto.tipoDocumentoDto);
        anyForm.controls["numDocumento"].setValue(dto.numDocumento);
        anyForm.controls["nombres"].setValue(dto.nombres);
        anyForm.controls["apPaterno"].setValue(dto.apPaterno);
        anyForm.controls["apMaterno"].setValue(dto.apMaterno);
        anyForm.controls["razSocial"].setValue(dto.razSocial);
        this.addGenericValuesConstrolsNoObj(anyForm, dto);
    }

    public getsLoginEmail = (loginEmail: string): Observable<any> => {
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))

        return this.http.get(this.url + "getsLoginEmail/" + loginEmail, { headers: headersSecurity }).map(this.cargarData)
            .catch(this.cargarError);
    }

    public updatePerfil = (dto: any): Observable<any> => {
        let headersSecurity: Headers = this.headers;
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.put(this.url + "save-perfil/" + dto.id, dto, { headers: headersSecurity })
            .map(this.cargarData)
            .catch(this.cargarError);
    }
}