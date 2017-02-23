import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { GeSocioNegocioCuentaService } from './service'
import { GeSocioNegocioCuentaDto } from './model'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeSocioNegocioService } from '../../configuracion/GeSocioNegocio/service'
import { GeSocioNegocioDto } from '../../configuracion/GeSocioNegocio/model'
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeMonedaDto } from '../../configuracion/GeMoneda/model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService, InputMaskModule, AutoCompleteModule} from 'primeng/primeng';
import { GeParametroDto } from '../../configuracion/GeParametro/model'
import { GeUbigeoService } from '../../configuracion/GeUbigeo/service'
import { GeUbigeoDto } from '../../configuracion/GeUbigeo/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";

@Component({
    selector: 'socioNegocioCuentaForm',
    providers: [GeSocioNegocioCuentaService, GeSocioNegocioService, GeMonedaService, GeParametroService, GeGenericConst, ConfirmationService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        '.ui-dialog-mask{z-index: 1000 !important;}'
    ]
})
export class GeSocioNegocioCuentaFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170118-Se crea componente GeSocioNegocioCuentaFormComponent para la logica de la pantalla del formulario de socio de negocio cuenta

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dtoSocio: GeSocioNegocioDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: GeSocioNegocioCuentaDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    public tipoDoc: string = "";

    //Autocomplete
    filteredSocNegocio: any[];

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitBanco: SelectItem[];
    public sitMoneda: SelectItem[];
    public sitEstado: SelectItem[];

    //Validaciones
    socioNegocioCuentaForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: GeSocioNegocioCuentaService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, private sNegocioService: GeSocioNegocioService,private monedaService: GeMonedaService, private parametroService: GeParametroService,
        private fb: FormBuilder, auth:AuthService) {
        super('GeSocioNegocioCuentaFormComponent', router, configuration,auth);
    }

    public ngOnInit(){
        this.socioNegocioCuentaForm = this.fb.group({
            'id': new FormControl('', Validators.nullValidator),
            'bancoDto': new FormControl('',  Validators.required),
            'monedaDto': new FormControl('',  Validators.required),
            'numCuenta': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'numCuentaCII': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'estado': new FormControl('', Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });

        this.addGenericControls(this.socioNegocioCuentaForm);
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
        this.getObjectDB();
        this.sitBanco = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 1);
        this.sitMoneda = this.monedaService.getSitMoneda(1);
        this.sitEstado = this.geGenericConst.getSitEstadoActivInactiv(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.socioNegocioCuentaForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.socioNegocioCuentaForm.reset();
            this.defaultValuesForm();
        }
    }

    //Evento despues de ocultar el componente modal
    onBeforeHide(event) {
        this.displayDialog = false;
        this.accion = 0;
        this.respuesta.emit({ severity: null, summary: null, detail: null, dto: null });
    }

    public crearFiltro(filter: string): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();
        filtro.fplantilla = true;

        filtro.plantilla = "{nombreCompleto} or {numDocumento}";

        if (filter != null && filter != '') {
                filtro.filtros.push(new GeFiltroDetaDto('nombreCompleto', this.geGenericConst.opeLike, this.geGenericConst.tdCaracter.codigo, '%' + filter + '%'));
                filtro.filtros.push(new GeFiltroDetaDto('numDocumento', this.geGenericConst.opeLike, this.geGenericConst.tdCaracter.codigo, filter + '%'));
        }

        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('id', this.geGenericConst.ordDes));

        return filtro;
    }

    public filterSocNegocio(event) {
        this.sNegocioService
            .gets(this.crearFiltro(event.query))
            .subscribe((response: GeSocioNegocioDto[]) => {
                    this.filteredSocNegocio = response;
                    //console.log( this.filteredSocNegocio);
                },
                error => {
                    this.mostrarError(error);
                }
            );
    }

    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        this.socioNegocioCuentaForm.controls["estado"].setValue("A");
    }

    //Evento despues de cerrar el componente modal (ya sea con la X o con Scape)
    public close() {
        this.onBeforeHide(null);
    }
    
    //Evento que guarda el registro del componente
    public save() {
        /*this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
               this.dto = this.socioNegocioCuentaForm.value;
               this.saveAlt();
            },
            reject: () => {
                //No realiza nada
            }
        });*/
        this.dto = this.socioNegocioCuentaForm.value;
        this.dto.socioNegocioDto = this.dtoSocio;
        this.saveAlt();
    }

    //Evento que guarda el registro en base de datos
    public saveAlt() {
        this.msgsPrincipal = [];
        let socioNeg = new GeSocioNegocioDto();
        socioNeg.id = this.dto.socioNegocioDto.id;
        this.dto.socioNegocioDto = socioNeg;

        let banco = new GeParametroDto();
        banco.id = this.dto.bancoDto.id;
        this.dto.bancoDto = banco;

        let moneda = new GeMonedaDto();
        moneda.id = this.dto.monedaDto.id;
        this.dto.monedaDto = moneda;

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