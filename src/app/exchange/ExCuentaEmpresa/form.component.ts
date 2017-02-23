import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { ExCuentaEmpresaService } from './service'
import { ExCuentaEmpresaDto } from './model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeMonedaDto } from '../../configuracion/GeMoneda/model'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeParametroDto } from '../../configuracion/GeParametro/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";

@Component({
    selector: 'cuentaEmpresaForm',
    providers: [ExCuentaEmpresaService, GeGenericConst, ConfirmationService, GeMonedaService, GeParametroService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class ExCuentaEmpresaFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170119-Se crea componente ExTipoCambioFormComponent para la logica de la pantalla del formulario de cuenta empresa

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: ExCuentaEmpresaDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitEstado: SelectItem[];
    public sitBanco: SelectItem[];
    public sitMoneda: SelectItem[];

    //Validaciones
    cuentaEmpresaForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: ExCuentaEmpresaService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, private serviceParametro: GeParametroService, private serviceMoneda: GeMonedaService,
        private fb: FormBuilder, auth:AuthService) {
        super('ExCuentaEmpresaFormComponent', router, configuration, auth);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    public ngOnInit() {
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        this.cuentaEmpresaForm = this.fb.group({
            'bancoDto': new FormControl('', Validators.required),
            'monedaDto': new FormControl('', Validators.required),
            'cuenta': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
            'cuentaInter': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
            'saldo': new FormControl('', Validators.compose([Validators.required, ValidationService.decimalValidator])),
            'estado': new FormControl('', Validators.required),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });
        this.addGenericControls(this.cuentaEmpresaForm);
    }

    //metodo para recuperar el objeto de la base de datos con el id
    getObjectDB() {
        if (this.dto.id!=null){
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
    onBeforeShow(event) {
        this.msgsPrincipal = [];
        this.getObjectDB();
        this.sitEstado = this.geGenericConst.getSitEstadoActivInactivSusp(1);
        this.sitBanco = this.serviceParametro.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 1);
        this.sitMoneda = this.serviceMoneda.getSitMoneda(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.cuentaEmpresaForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.cuentaEmpresaForm.reset();
            this.defaultValuesForm();
        }
    }

    //Evento despues de ocultar el componente modal
    onBeforeHide(event) {
        this.displayDialog = false;
        this.accion = 0;
        this.respuesta.emit({ severity: null, summary: null, detail: null, dto: null });
    }

    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        this.cuentaEmpresaForm.controls["estado"].setValue("A");
    }

    //Evento despues de cerrar el componente modal (ya sea con la X o con Scape)
    public close() {
        this.onBeforeHide(null);
    }
    
    //Evento que guarda el registro del componente
    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.cuentaEmpresaForm.value;
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
        let banco = new GeParametroDto();
        banco.id = this.dto.bancoDto.id;
        this.dto.bancoDto = banco;
        let monenda = new GeMonedaDto();
        monenda.id = this.dto.monedaDto.id;
        this.dto.monedaDto = monenda;
        if(this.accion == 1 || this.accion == 4){
            if (this.accion = 4) //Si es clonacion
                this.dto.id = null;
            this.service
            .save(this.dto)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.displayDialog = false;
                    this.accion = 0;
                    this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                },
                error => {
                    let errorHttpDto:GeMensajeHttpDto = error;
                    this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    this.displayDialog = true;
                }
            );
        }else if(this.accion == 2){//Si es edicion
            this.service
            .update(this.dto)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.displayDialog = false;
                    this.accion = 0;
                    this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                },
                error => {
                    let errorHttpDto:GeMensajeHttpDto = error;
                    this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    this.displayDialog = true;
                }
            );
        }
    }  
}