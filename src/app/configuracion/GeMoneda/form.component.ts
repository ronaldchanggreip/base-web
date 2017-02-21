import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { GeMonedaService } from './service'
import { GeMonedaDto } from './model'
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService} from 'primeng/primeng';
import { GeUbigeoService } from '../GeUbigeo/service'
import { GeUbigeoDto } from '../GeUbigeo/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";


@Component({
    selector: 'monedaForm',
    providers: [GeMonedaService, GeGenericConst, ConfirmationService, GeUbigeoService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class GeMonedaFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170112-Se crea componente GeMonedaFormComponent para la logica de la pantalla del formulario de monedas

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: GeMonedaDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitUbigeo: SelectItem[];

    //Validaciones
    monedaForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: GeMonedaService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, private serviceUbigeo: GeUbigeoService, private fb: FormBuilder, auth:AuthService) {
        super('GeMonedaFormComponent', router, configuration,auth);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    public ngOnInit() {
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        this.monedaForm = this.fb.group({
            'nombre': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'nombreCorto': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
            'nombreTrx': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'simbolo': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
            'paisDto': new FormControl('', Validators.required),
            'estado': new FormControl('', Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });
        this.addGenericControls(this.monedaForm);
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
        this.sitUbigeo = this.serviceUbigeo.getSitUbigeo(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.monedaForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.monedaForm.reset();
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
        this.monedaForm.controls["estado"].setValue(true);
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
               this.dto = this.monedaForm.value;
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
        let ubi = new GeUbigeoDto();
        ubi.id = this.dto.paisDto.id;
        this.dto.paisDto = ubi;
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