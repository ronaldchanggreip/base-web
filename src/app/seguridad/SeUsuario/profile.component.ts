import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { SeUsuarioService } from './service'
import { SeUsuarioDto } from './model'
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message, PasswordModule, InputSwitchModule } from 'primeng/primeng';
import { SelectItem, ConfirmationService} from 'primeng/primeng';
import { GeSocioNegocioService } from '../../configuracion/GeSocioNegocio/service'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";
import {SeRolService} from "../SeRol/service";
import {SeRolDto} from "../SeRol/model";
import {GeParametroService} from "../../configuracion/GeParametro/service";
import {GeParametroDto} from "../../configuracion/GeParametro/model";
import {GeSocioNegocioDto} from "../../configuracion/GeSocioNegocio/model";

@Component({
    selector: 'profileForm',
    providers: [SeUsuarioService, SeRolService, AuthService , GeParametroService, GeSocioNegocioService, GeGenericConst, ConfirmationService],
    templateUrl: 'profile.html',
    encapsulation: ViewEncapsulation.None
})
export class SeUsuarioProfileComponent extends GeBaseComponent implements OnInit{

    public dto: SeUsuarioDto;
    public socioDto: GeSocioNegocioDto;
    public msgsPrincipal: Message[] = [];
    public isChangePassword: boolean = false;
    public visibleSocNego: boolean = false;

    usuarioForm: FormGroup;

    constructor(router: Router, private service: SeUsuarioService, private authService: AuthService, private rolService: SeRolService, private parametroService: GeParametroService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, private socNegocioService: GeSocioNegocioService, private fb: FormBuilder, auth:AuthService) {
        super('SeUsuarioProfileComponent', router, configuration,auth);
    }

    public ngOnInit(){
        this.dto = new SeUsuarioDto();
        this.dto.rolDto = new SeRolDto();
        this.usuarioForm = this.fb.group({
            'nombre': new FormControl('' , Validators.compose([Validators.required, Validators.maxLength(100)])),
            'email': new FormControl('', Validators.compose([Validators.required, ValidationService.emailValidator])),
            'contrasena': new FormControl('', Validators.compose([Validators.required, ValidationService.passwordValidator])),
            'confirmContrasena': new FormControl('', Validators.required),
            'cambiarPassword': new FormControl('', Validators.nullValidator)
        });

        this.cargarDatos();
    }

    private cargarDatos(){
        this.visibleSocNego = false;
        //Obtenemos al usuario asociado a la sesion
        let login = this.authService.oauth_token.access_login;
        this.service.getsLoginEmail(login)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.dto = response.respuesta;
                    this.usuarioForm.controls["nombre"].setValue(this.dto.nombre);
                    this.usuarioForm.controls["email"].setValue(this.dto.email);
                    this.usuarioForm.controls["cambiarPassword"].setValue(false);
                    this.changeCambiarContrasena();
                    if(this.dto.socioNegocio){
                        this.socNegocioService.get(this.dto.socioNegocio)
                            .subscribe(
                                (response2: GeMensajeHttpDto) => {
                                    this.visibleSocNego = true;
                                    this.socioDto = response2.respuesta;
                                },
                                error => {
                                    this.mostrarError(error);
                                }
                            );
                    }
                },
                error => {
                    this.mostrarError(error);
                }
            );
    }

    public changeCambiarContrasena(){
        this.isChangePassword = this.usuarioForm.controls["cambiarPassword"].value;
        this.usuarioForm.controls['contrasena'].setValidators(null);
        this.usuarioForm.controls['confirmContrasena'].setValidators(null);
        if(this.isChangePassword){
            this.usuarioForm.controls['contrasena'].setValidators(Validators.compose([Validators.required, ValidationService.passwordValidator]));
            this.usuarioForm.controls['confirmContrasena'].setValidators(Validators.required);
        }
        this.usuarioForm.controls['contrasena'].updateValueAndValidity();
        this.usuarioForm.controls['confirmContrasena'].updateValueAndValidity();
    }

    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea editar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto.nombre = this.usuarioForm.controls["nombre"].value;
                this.dto.email = this.usuarioForm.controls["email"].value;
                if(this.isChangePassword){
                    this.dto.contrasena =  this.usuarioForm.controls["contrasena"].value;
                    this.dto.confirmContrasena =  this.usuarioForm.controls["confirmContrasena"].value;
                }

                this.saveAlt();
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    public saveAlt() {
        this.msgsPrincipal = [];

        var valid = (this.dto.contrasena == this.dto.confirmContrasena);

        if(this.isChangePassword){
            if (!valid) {
                this.msgsPrincipal.push({severity: 'error', summary: 'Mensaje de Error', detail: 'Las contraseñas no coinciden!'});
            }
        }
        if(valid){
            this.dto.cambiarPassword = this.isChangePassword;
            this.service
                .updatePerfil(this.dto)
                .subscribe(
                    (response: GeMensajeHttpDto) => {
                        if (response.codigoHttp == this.geGenericConst.codErrorValidacion200) {
                            this.msgsPrincipal.push({severity: 'error', summary: "Mensaje de validación", detail: response.mensajeUsuario});
                        } else {
                            this.msgsPrincipal.push({severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario});
                            this.cargarDatos();
                        }
                    },
                    error => {
                        let errorHttpDto: GeMensajeHttpDto = error;
                        this.msgsPrincipal.push({severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp});
                    }
                );
        }
    }
}