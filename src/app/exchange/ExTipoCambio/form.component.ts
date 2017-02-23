import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { ExTipoCambioService } from './service'
import { ExTipoCambioDto } from './model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeGenericConst } from '../../common/generic.const'
import { Message, CalendarModule } from 'primeng/primeng';
import { SelectItem, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeMonedaDto } from '../../configuracion/GeMoneda/model'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeParametroDto } from '../../configuracion/GeParametro/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";


@Component({
    selector: 'tipoCambioForm',
    providers: [ExTipoCambioService, GeGenericConst, ConfirmationService, GeMonedaService, GeParametroService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        '.ui-dialog .ui-dialog-content{overflow: inherit !important;} body .ui-widget-content{overflow: inherit;}'
    ]
})
export class ExTipoCambioFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170113-Se crea componente ExTipoCambioFormComponent para la logica de la pantalla del formulario de tipo de cambio

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: ExTipoCambioDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitTipo: SelectItem[];
    public sitBanco: SelectItem[];
    public sitMoneda: SelectItem[];

    es: any;

    //Validaciones
    tipoCambioForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: ExTipoCambioService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, private serviceParametro: GeParametroService, private serviceMoneda: GeMonedaService,
        private fb: FormBuilder, auth:AuthService) {
        super('ExTipoCambioFormComponent', router, configuration, auth);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    public ngOnInit() {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ]
        }

        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        this.tipoCambioForm = this.fb.group({
            'bancoDto': new FormControl('', Validators.required),
            'monedaDestinoDto': new FormControl('', Validators.required),
            'monedaOrigenDto': new FormControl('', Validators.required),
            'precioCompra': new FormControl('', Validators.compose([Validators.required, ValidationService.decimalValidator])),
            'precioVenta': new FormControl('', Validators.compose([Validators.required, ValidationService.decimalValidator])),
            'fechaVigencia': new FormControl(Validators.required),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });

        this.addGenericControls(this.tipoCambioForm);
        this.tipoCambioForm.reset();
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
        this.sitTipo = this.geGenericConst.getSitTipoCambio(1);
        this.sitBanco = this.serviceParametro.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 1);
        this.sitMoneda = this.serviceMoneda.getSitMoneda(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.tipoCambioForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.tipoCambioForm.reset();
            this.tipoCambioForm.controls["fechaVigencia"].setValue(new Date());
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
    
    //Evento que guarda el registro del componente
    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.tipoCambioForm.value;
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
        if(this.dto.monedaOrigenDto.id == this.dto.monedaDestinoDto.id){
            valid = false;
        }

        if(!valid){
            this.msgsPrincipal.push({ severity: 'error', summary: 'Mensaje de Error', detail: 'La moneda de origen y destino no pueden ser iguales!' });
            this.displayDialog = true;
        }else{
            let banco = new GeParametroDto();
            banco.id = this.dto.bancoDto.id;
            this.dto.bancoDto = banco;
            let monOrigen = new GeMonedaDto();
            monOrigen.id = this.dto.monedaOrigenDto.id;
            this.dto.monedaOrigenDto = monOrigen;
            let monDestino = new GeMonedaDto();
            monDestino.id = this.dto.monedaDestinoDto.id;
            this.dto.monedaDestinoDto = monDestino;
            if(this.accion == 1 || this.accion == 4){
                if (this.accion = 4) //Si es clonacion
                    this.dto.id = null;
                this.dto.factor = 0;
                this.dto.tipo = 'C';
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
                this.dto.factor = 0;
                this.dto.tipo = 'C';
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
}