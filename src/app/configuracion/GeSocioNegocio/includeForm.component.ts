import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { GeSocioNegocioService } from './service'
import { GeSocioNegocioDto } from './model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeGenericConst } from '../../common/generic.const'
import { Message, TabViewModule} from 'primeng/primeng';
import { SelectItem, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeParametroDto } from '../../configuracion/GeParametro/model'
import { GeUbigeoService } from '../../configuracion/GeUbigeo/service'
import { GeUbigeoDto } from '../../configuracion/GeUbigeo/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import {AuthService} from "../../seguridad/auth.service";

@Component({
    selector: 'socioNegocioIncludeForm',
    providers: [GeSocioNegocioService, GeGenericConst, ConfirmationService, GeParametroService, GeUbigeoService],
    templateUrl: 'includeForm.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        '.ui-dialog{overflow: inherit !important;} body .ui-widget-content{overflow: inherit;}'
    ]
})
export class GeSocioNegocioIncludeFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170118-Se crea componente SocioNegocioFormComponent para la logica de la pantalla del formulario de socio de negocio

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: GeSocioNegocioDto;

    public tipoDoc: string = "";

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitTipoDocumento: SelectItem[];
    public sitEstado: SelectItem[];
    public sitUbigeo: SelectItem[];
    public accion: number = 0;

    //Validaciones
    socioNegocioForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: GeSocioNegocioService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, private parametroService: GeParametroService, private ubigeoService: GeUbigeoService,
                private fb: FormBuilder, auth:AuthService) {
        super('GeSocioNegocioFormComponent', router, configuration, auth);
    }

    public ngOnInit(){
        this.widthDialog = window.innerWidth*this.configuration.appDialogMax;
        this.socioNegocioForm = this.fb.group({
            'tipoDocumentoDto': new FormControl('', Validators.required),
            'numDocumento': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
            'nombres': new FormControl('', Validators.maxLength(100)),
            'apPaterno': new FormControl('', Validators.maxLength(50)),
            'apMaterno': new FormControl('', Validators.maxLength(50)),
            'razSocial': new FormControl('', Validators.maxLength(300)),
            'indCliente': new FormControl('', Validators.nullValidator),
            'indProveedor': new FormControl('', Validators.nullValidator),
            'telefPrincipal': new FormControl('', Validators.maxLength(50)),
            'anexoPrincipal': new FormControl('', Validators.maxLength(10)),
            'telefSecundario': new FormControl('', Validators.maxLength(50)),
            'anexoSecundario': new FormControl('', Validators.maxLength(10)),
            'movilPrincipal': new FormControl('', Validators.maxLength(50)),
            'movilSecundario': new FormControl('', Validators.maxLength(50)),
            'nacionalidadDto': new FormControl('', Validators.required),
            'comentario': new FormControl('', Validators.maxLength(4000)),
            'estado': new FormControl('', Validators.required),
            'eliminado': new FormControl('', Validators.nullValidator)
        });
        this.addGenericControls(this.socioNegocioForm);

        this.cargarDatos();
    }

    //metodo para recuperar el objeto de la base de datos con el id
    getObjectDB() {
        if(this.dto){
        this.service
            .get(this.dto.id)
            .subscribe(
                (response: GeMensajeHttpDto) => { this.dto = response.respuesta;},
                error => {
                    this.mostrarError(error);
                }
            );
        }
    }

    //Evento despues de mostrar el componente modal
    cargarDatos() {
        this.msgsPrincipal = [];
        this.getObjectDB();
        this.sitTipoDocumento = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpTipoDoc, 1);
        this.sitUbigeo = this.ubigeoService.getSitUbigeo(1);
        this.sitEstado = this.geGenericConst.getSitEstadoActivInactiv(1);

        //Si es edicion asignamos los valores del dto al FormGroup
        this.service.addValuesControls(this.socioNegocioForm, this.dto);
        this.changeTipoDocumento();
        this.accion = 2;
    }


    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        var defaultUbigeo = new GeUbigeoDto();
        defaultUbigeo.id = this.geGenericConst.codUbigeoDefault;
        this.ubigeoService.getDefaultUbigeoCtrl(this.socioNegocioForm.controls["nacionalidadDto"]);
        this.socioNegocioForm.controls["indCliente"].setValue(true);
        this.socioNegocioForm.controls["indProveedor"].setValue(false);
    }

    //Evento change tipo de documento
    public changeTipoDocumento(){
        this.socioNegocioForm.controls['nombres'].setValidators(null);
        this.socioNegocioForm.controls['apPaterno'].setValidators(null);
        this.socioNegocioForm.controls['apMaterno'].setValidators(null);
        this.socioNegocioForm.controls['razSocial'].setValidators(null);
        if(this.socioNegocioForm.controls['tipoDocumentoDto'].value){
            if(this.socioNegocioForm.controls['tipoDocumentoDto'].value.id == this.geGenericConst.paramTipoDocDni){
                //console.log("DNI");
                this.tipoDoc = "N";

                this.socioNegocioForm.controls['nombres'].setValidators(Validators.required);
                this.socioNegocioForm.controls['apPaterno'].setValidators(Validators.required);
                this.socioNegocioForm.controls['apMaterno'].setValidators(Validators.required);
            }else if(this.socioNegocioForm.controls['tipoDocumentoDto'].value.id == this.geGenericConst.paramTipoDocRuc){
                //console.log("RUC");
                this.tipoDoc = "J";
                this.socioNegocioForm.controls['razSocial'].setValidators(Validators.required)
            }
        }else
            this.tipoDoc = "";
        this.socioNegocioForm.controls['nombres'].updateValueAndValidity();
        this.socioNegocioForm.controls['apPaterno'].updateValueAndValidity();
        this.socioNegocioForm.controls['apMaterno'].updateValueAndValidity();
        this.socioNegocioForm.controls['razSocial'].updateValueAndValidity();
    }

    //Evento que guarda el registro del componente
    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.socioNegocioForm.value;
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
        //Verificamos que se haya seleccionar cliente o proveedor
        if(!this.dto.indCliente && !this.dto.indProveedor){
            valid = false;
        }

        if(!valid){
            this.msgsPrincipal.push({ severity: 'error', summary: 'Mensaje de Error', detail: 'El socio del negocio debe ser cliente, proveedor o ambos, por favor seleccione alguna de esas opciones!' });
        }else{
            let tipoDoc = new GeParametroDto();
            tipoDoc.id = this.dto.tipoDocumentoDto.id;
            this.dto.tipoDocumentoDto = tipoDoc;

            let nacionalidad = new GeUbigeoDto();
            nacionalidad.id = this.dto.nacionalidadDto.id;
            this.dto.nacionalidadDto = nacionalidad;

            let nombreCompleto = "";
            if(this.dto.tipoDocumentoDto.id == this.geGenericConst.paramTipoDocDni){
                nombreCompleto = this.dto.nombres + " " + this.dto.apPaterno + " " + this.dto.apMaterno;
                this.dto.razSocial = "";
            }else if(this.dto.tipoDocumentoDto.id == this.geGenericConst.paramTipoDocRuc){
                nombreCompleto = this.dto.razSocial;
                this.dto.nombres = "";
                this.dto.apPaterno = "";
                this.dto.apMaterno = "";
            }
            this.dto.nombreCompleto = nombreCompleto;

            this.service
                .update(this.dto)
                .subscribe(
                    (response: GeMensajeHttpDto) => {
                        this.msgsPrincipal.push({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario });
                    },
                    error => {
                        let errorHttpDto:GeMensajeHttpDto = error;
                        this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    }
                );
        }
    }
}