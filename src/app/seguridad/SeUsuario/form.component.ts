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
    selector: 'usuarioForm',
    providers: [SeUsuarioService, SeRolService , GeParametroService, GeSocioNegocioService, GeGenericConst, ConfirmationService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class SeUsuarioFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170215-Se crea componente SeUsuarioFormComponent para la logica de la pantalla del formulario de usuarios

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: SeUsuarioDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    public tipoDoc: string = "";
    public sitTipoDocumento: SelectItem[];
    public sitRol: SelectItem[] = [];
    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public isChangePassword: boolean = false;
    public visibleSocNego: boolean = false;

    //Validaciones
    usuarioForm: FormGroup;

    constructor(router: Router, private service: SeUsuarioService, private rolService: SeRolService, private parametroService: GeParametroService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, private socNegocioService: GeSocioNegocioService, private fb: FormBuilder, auth:AuthService) {
        super('SeUsuarioFormComponent', router, configuration,auth);
    }

    public ngOnInit(){
        this.widthDialog = window.innerWidth*this.configuration.appDialogMin;
        this.usuarioForm = this.fb.group({
            'nombre': new FormControl('' , Validators.compose([Validators.required, Validators.maxLength(100)])),
            'login': new FormControl('', Validators.compose([Validators.required, ValidationService.loginValidator])),
            'email': new FormControl('', Validators.compose([Validators.required, ValidationService.emailValidator])),
            'rolDto': new FormControl('', Validators.required),
            'contrasena': new FormControl('', Validators.compose([Validators.required, ValidationService.passwordValidator])),
            'confirmContrasena': new FormControl('', Validators.required),
            'confirmEmail': new FormControl('', Validators.required),
            'indBloqueado': new FormControl('', Validators.nullValidator),
            'estado': new FormControl('', Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000)),
            'cambiarPassword': new FormControl('', Validators.nullValidator),

            'tipoDocumentoDto': new FormControl('', Validators.required),
            'numDocumento': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
            'nombres': new FormControl('', Validators.maxLength(100)),
            'apPaterno': new FormControl('', Validators.maxLength(50)),
            'apMaterno': new FormControl('', Validators.maxLength(50)),
            'razSocial': new FormControl('', Validators.maxLength(300))
        });

        this.addGenericControlsNoObj(this.usuarioForm);
    }

    //metodo para recuperar el objeto de la base de datos con el id
    getObjectDB() {
        if (this.dto.id!=null){
            this.service
                .get(this.dto.id)
                .subscribe(
                    (response: GeMensajeHttpDto) => { this.dto = response.respuesta;
                        if(this.accion == 2 || this.accion == 4){
                            //Si es edicion asignamos los valores del dto al FormGroup
                            this.service.addValuesControls(this.usuarioForm, this.dto);
                            this.changeTipoDocumento();
                            this.changeRol();
                            this.changeCambiarContrasena();
                            this.defaultValuesEditForm();
                        }
                    },
                    error => {
                        this.mostrarError(error);
                    }
                );
        }
    }

    //Evento despues de mostrar el componente modal
    onBeforeShow(event) {
        this.msgsPrincipal = [];
        this.getObjectDB();
        this.sitTipoDocumento = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpTipoDoc, 1);
        this.sitRol = this.rolService.getSitRol(1);
        if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.usuarioForm.reset();
            this.defaultValuesForm();
            this.isChangePassword = true;
        }else if (this.accion == 2){
            this.isChangePassword = false;
            this.usuarioForm.controls["cambiarPassword"].setValue(false);
        }
    }

    //Evento despues de ocultar el componente modal
    onBeforeHide(event) {
        this.displayDialog = false;
        this.accion = 0;
        this.respuesta.emit({ severity: null, summary: null, detail: null, dto: null });
    }

    //Evento despues de cerrar el componente modal (ya sea con la X o con Scape)
    public close() {
        this.onBeforeHide(null);
    }

    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        this.usuarioForm.controls["estado"].setValue(true);
        this.usuarioForm.controls["indBloqueado"].setValue(false);
        this.usuarioForm.controls["cambiarPassword"].setValue(false);
    }

    public defaultValuesEditForm(){
        this.usuarioForm.controls["cambiarPassword"].setValue(false);
        this.usuarioForm.controls["confirmEmail"].setValidators(null);
        this.usuarioForm.controls["confirmEmail"].updateValueAndValidity();
        this.usuarioForm.controls["cambiarPassword"].updateValueAndValidity();
    }

    public changeRol(){
        this.visibleSocNego = false;
        if(this.usuarioForm.controls["rolDto"].value.id == this.geGenericConst.codRolWeb){
            this.usuarioForm.controls['tipoDocumentoDto'].setValidators(Validators.required);
            this.visibleSocNego = true;
        }else{
            this.usuarioForm.controls['tipoDocumentoDto'].setValidators(null);
            this.usuarioForm.controls['nombres'].setValidators(null);
            this.usuarioForm.controls['apPaterno'].setValidators(null);
            this.usuarioForm.controls['apMaterno'].setValidators(null);
            this.usuarioForm.controls['razSocial'].setValidators(null);
        }
        this.usuarioForm.controls['tipoDocumentoDto'].updateValueAndValidity();
        this.usuarioForm.controls['nombres'].updateValueAndValidity();
        this.usuarioForm.controls['apPaterno'].updateValueAndValidity();
        this.usuarioForm.controls['apMaterno'].updateValueAndValidity();
        this.usuarioForm.controls['razSocial'].updateValueAndValidity();
    }

    //Evento change tipo de documento
    public changeTipoDocumento(){
        this.usuarioForm.controls['nombres'].setValidators(null);
        this.usuarioForm.controls['apPaterno'].setValidators(null);
        this.usuarioForm.controls['apMaterno'].setValidators(null);
        this.usuarioForm.controls['razSocial'].setValidators(null);
        if(this.usuarioForm.controls['tipoDocumentoDto'].value){
            if(this.usuarioForm.controls['tipoDocumentoDto'].value.id == this.geGenericConst.paramTipoDocDni){
                this.tipoDoc = "N";

                this.usuarioForm.controls['nombres'].setValidators(Validators.required);
                this.usuarioForm.controls['apPaterno'].setValidators(Validators.required);
                this.usuarioForm.controls['apMaterno'].setValidators(Validators.required);
            }else if(this.usuarioForm.controls['tipoDocumentoDto'].value.id == this.geGenericConst.paramTipoDocRuc){
                //console.log("RUC");
                this.tipoDoc = "J";
                this.usuarioForm.controls['razSocial'].setValidators(Validators.required)
            }
        }else
            this.tipoDoc = "";
        this.usuarioForm.controls['nombres'].updateValueAndValidity();
        this.usuarioForm.controls['apPaterno'].updateValueAndValidity();
        this.usuarioForm.controls['apMaterno'].updateValueAndValidity();
        this.usuarioForm.controls['razSocial'].updateValueAndValidity();
    }

    public onBlurNumDoc(){
        this.obtenerSocioPorDocumento();
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

    public obtenerSocioPorDocumento(){
        var tipo: GeParametroDto = this.usuarioForm.controls['tipoDocumentoDto'].value;
        var numero = this.usuarioForm.controls['numDocumento'].value;
        this.usuarioForm.controls['razSocial'].setValue("");
        if(tipo && numero){
            this.socNegocioService
                .getsByDocumento(tipo.id, numero)
                .subscribe(
                    (response: GeMensajeHttpDto) => {
                        let socNego: GeSocioNegocioDto = response.respuesta;
                        if(socNego){
                            if(this.usuarioForm.controls['tipoDocumentoDto'].value.id == this.geGenericConst.paramTipoDocDni){
                                this.usuarioForm.controls['nombres'].setValue(socNego.nombres);
                                this.usuarioForm.controls['apPaterno'].setValue(socNego.apPaterno);
                                this.usuarioForm.controls['apMaterno'].setValue(socNego.apMaterno);
                            }else{
                                this.usuarioForm.controls['razSocial'].setValue(socNego.razSocial);
                            }
                        }
                    },
                    error => {
                        let errorHttpDto: GeMensajeHttpDto = error;
                        this.msgsPrincipal.push({
                            severity: 'error',
                            summary: errorHttpDto.resumenHttp,
                            detail: errorHttpDto.mensajeSistemaHttp
                        });
                        this.displayDialog = true;
                    }
                );
        }
    }

    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.usuarioForm.value;
                this.saveAlt();
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    //Evento que guarda el registro en base de datos
    public saveAlt() {
        this.msgsPrincipal = [];
        let valid = true;
        var compare1 = (this.dto.contrasena == this.dto.confirmContrasena);
        var compare2 = (this.dto.email == this.dto.confirmEmail);

        if(this.accion == 1 || this.isChangePassword){
            if (!compare1) {
                this.msgsPrincipal.push({severity: 'error', summary: 'Mensaje de Error', detail: 'Las contraseñas no coinciden!'});
            }
        }else
            compare1 = true;

        if(this.accion == 2)
            compare2 = true;
        if (!compare2) {
            this.msgsPrincipal.push({severity: 'error', summary: 'Mensaje de Error', detail: 'Las direcciones de email no coinciden!'});
        }

        valid = compare1 && compare2;

        if (valid) {
            let rol = new SeRolDto();
            rol.id = this.dto.rolDto.id;
            this.dto.rolDto = rol;
            if (this.dto.rolDto.id == this.geGenericConst.codRolWeb) {
                let tipoDoc = new GeParametroDto();
                tipoDoc.id = this.dto.tipoDocumentoDto.id;
                this.dto.tipoDocumentoDto = tipoDoc;
            }

            console.log();

            if (this.accion == 1 || this.accion == 4) {
                if (this.accion = 4) //Si es clonacion
                    this.dto.id = null;
                this.service
                    .save(this.dto)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            if (response.codigoHttp == this.geGenericConst.codErrorValidacion200) {
                                this.msgsPrincipal.push({severity: 'error', summary: "Mensaje de validación", detail: response.mensajeUsuario});
                            } else {
                                this.displayDialog = false;
                                this.accion = 0;
                                this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                            }
                        },
                        error => {
                            let errorHttpDto: GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp});
                            this.displayDialog = true;
                        }
                    );
            } else if (this.accion == 2) {//Si es edicion
                this.dto.cambiarPassword = this.isChangePassword;
                this.service
                    .update(this.dto)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            if (response.codigoHttp == this.geGenericConst.codErrorValidacion200) {
                                this.msgsPrincipal.push({severity: 'error', summary: "Mensaje de validación", detail: response.mensajeUsuario});
                            } else {
                                this.displayDialog = false;
                                this.accion = 0;
                                this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                            }
                        },
                        error => {
                            let errorHttpDto: GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp});
                            this.displayDialog = true;
                        }
                    );
            }
        }
    }
}