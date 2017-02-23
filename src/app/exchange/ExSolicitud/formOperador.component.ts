import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { ExSolicitudService } from './service'
import { ExSolicitudDto } from './model'
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeSocioNegocioService } from '../../configuracion/GeSocioNegocio/service'
import { GeSocioNegocioDto } from '../../configuracion/GeSocioNegocio/model'
import { ExTipoCambioDto } from '../../exchange/ExTipoCambio/model'
import { ExTipoCambioService } from '../../exchange/ExTipoCambio/service'
import { ExCuentaEmpresaService } from '../../exchange/ExCuentaEmpresa/service'
import { ExCuentaEmpresaDto } from '../../exchange/ExCuentaEmpresa/model'
import { GeSocioNegocioCuentaService } from '../../configuracion/GeSocioNegocioCuenta/service'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { GeMonedaDto } from '../../configuracion/GeMoneda/model'
import { GeParametroDto } from '../../configuracion/GeParametro/model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import { AuthService } from '../../seguridad/auth.service'
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {isNumeric} from '../../generic/util/isNumeric'
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Component({
    selector: 'solicitudOperadorForm',
    providers: [ExSolicitudService, GeMonedaService, GeParametroService, GeSocioNegocioService, GeSocioNegocioCuentaService, ExCuentaEmpresaService, GeGenericConst, ConfirmationService, AuthService],
    templateUrl: 'formOperador.html',
    encapsulation: ViewEncapsulation.None
})
export class ExSolicitudOperadorFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170123-Se crea componente ExSolicitudSocioFormComponent para la logica de la pantalla del formulario de solicitud - socio

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: ExSolicitudDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();


    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitTipoTransaccion: SelectItem[];
    public sitTipoCambio: SelectItem[];
    public socioNegocioDto: GeSocioNegocioDto;
    public tCambioDto: ExTipoCambioDto = new ExTipoCambioDto();
    public valorTC: number;
    public impDestino: number = 0;
    public sitBanco: SelectItem[];
    public sitCuentaEmp: SelectItem[];
    public sitMoneda: SelectItem[];
    public sitCuentaSocio: SelectItem[];
    public filteredSocNegocio: any[];
    public entidad: number = this.geGenericConst.entSistSolicitud;
    public flagBtnAnular: boolean;
    public flagBtnGuardar: boolean;
    public flagBtnObservar: boolean;
    public flagBtnRevisar: boolean;
    public flagAbortar: boolean;
    public flagInfoEjecutar: boolean;
    public cuentaDestinoEjecutada: string = "";

    //Validaciones
    solicitudSocioForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router,
                private service: ExSolicitudService,
                private monedaService: GeMonedaService,
                private tipoCambioService: ExTipoCambioService,
                private parametroService: GeParametroService,
                private cEmpresaService: ExCuentaEmpresaService,
                private socCEmpresa: GeSocioNegocioCuentaService,
                private socNegocioService: GeSocioNegocioService,
                private socNegocioCuentaService: GeSocioNegocioCuentaService,
                private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService,
                private authService: AuthService,
                private fb: FormBuilder,
                configuration: AppConfiguration){
        super('ExSolicitudOperadorFormComponent', router, configuration,authService);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    public ngOnInit(){
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        this.solicitudSocioForm = this.fb.group({
            'socioNegocioDto': new FormControl('', Validators.required),
            'transaccion': new FormControl(Validators.required),
            'importeOrigen': new FormControl('', Validators.compose([Validators.required, ValidationService.decimalValidator])),

            'bancoOrigenDto': new FormControl('', Validators.required),
            'cEmpOrigenDto': new FormControl('', Validators.required),
            'numVoucherOrigen': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
            'monedaOrigenDto': new FormControl('', Validators.required),

            'bancoDestinoDto': new FormControl('', Validators.required),
            'cBancariaDestinoDto': new FormControl('', Validators.required),
            'monedaDestinoDto': new FormControl('', Validators.required),
            'etapa': new FormControl('', Validators.nullValidator),
            'estado': new FormControl('', Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });

        this.addGenericControls(this.solicitudSocioForm);
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

    public crearFiltroSN(filter: string): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();
        filtro.fplantilla = true;

        filtro.plantilla = "({nombreCompleto} or {numDocumento}) and {indCliente} and {estado}";

        if (filter != null && filter != '') {
            filtro.filtros.push(new GeFiltroDetaDto('nombreCompleto', this.geGenericConst.opeLike, this.geGenericConst.tdCaracter.codigo, '%' + filter + '%'));
            filtro.filtros.push(new GeFiltroDetaDto('numDocumento', this.geGenericConst.opeLike, this.geGenericConst.tdCaracter.codigo, filter + '%'));
        }

        filtro.filtros.push(new GeFiltroDetaDto('indCliente', this.geGenericConst.opeEq, this.geGenericConst.tdBoolean.codigo, 'true'));
        filtro.filtros.push(new GeFiltroDetaDto('estado', this.geGenericConst.opeEq, this.geGenericConst.tdCaracter.codigo, 'A'));
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('id', this.geGenericConst.ordDes));

        return filtro;
    }

    public filterSocNegocio(event) {
        this.socNegocioService
            .gets(this.crearFiltroSN(event.query))
            .subscribe((response: GeMensajeHttpDto) => {
                    this.filteredSocNegocio = response.respuesta;
                },
                error => {
                    this.mostrarError(error);
                }
            );
    }

    public defaultValuesForm(){
        if(this.accion == 1){
            //Verificamos si se trata de un usuario admin o un socio de negocio
            this.getSocioPorUsuario();
        }
    }

    //Evento despues de mostrar el componente modal
    onBeforeShow(event) {
        this.msgsPrincipal = [];
        this.getObjectDB();
        this.sitTipoTransaccion = this.geGenericConst.getSitTipoCambio(1);
        this.sitBanco = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 1);
        this.sitMoneda = this.monedaService.getSitMoneda(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControlsSocio(this.solicitudSocioForm, this.dto);
            this.tCambioDto = this.dto.tipoCambioDto;
            this.impDestino = this.dto.importeDestino;
            //Cargamos los combos dependientes
            this.sitTipoCambio =  [];
            if(this.dto.transaccion == "C")
                this.valorTC = this.dto.tipoCambioDto.precioCompra;
            else
                this.valorTC = this.dto.tipoCambioDto.precioVenta;

            this.sitCuentaEmp = [];
            this.sitCuentaEmp.push({ label: this.dto.cEmpOrigenDto.cuenta + " - (CI: " +  this.dto.cEmpOrigenDto.cuentaInter + ")", value: this.dto.cEmpOrigenDto });

            this.sitCuentaSocio = [];
            this.sitCuentaSocio.push({ label: this.dto.cBancariaDestinoDto.numCuenta + " - (CI: " +  this.dto.cBancariaDestinoDto.numCuentaCII + ")", value: this.dto.cBancariaDestinoDto });

        }else if(this.accion == 1){
            this.tCambioDto = new ExTipoCambioDto();
            this.impDestino = 0;
            //Si es nuevo reseteamos los valores del FormGroup
            this.solicitudSocioForm.reset();
            this.sitTipoCambio =  [];
            this.sitCuentaEmp = [];
            this.sitCuentaSocio = [];
            this.defaultValuesForm();
        }
        this.gestionarBtns();
    }

    private gestionarBtns(){
        this.flagBtnAnular = false;
        this.flagBtnGuardar = false;
        this.flagBtnObservar = false;
        this.flagBtnRevisar = false;
        this.flagAbortar = false;
        this.flagInfoEjecutar = false;
        if(this.accion == 1){
            this.flagBtnGuardar = true;
        }else{
            if(!(this.dto.estado == this.geGenericConst.ESTSOL_COD_ANULADA || this.dto.estado == this.geGenericConst.ESTSOL_COD_ABORTADA || this.dto.estado == this.geGenericConst.ESTSOL_COD_EJECUTADA)){
                this.flagBtnAnular = true;
                this.flagAbortar = true;
                this.flagBtnGuardar = true;
            }

            if(((this.dto.etapa == this.geGenericConst.ETAPASOL_COD_REGISTRO || this.dto.etapa == this.geGenericConst.ETAPASOL_COD_REVISION) && this.dto.estado == this.geGenericConst.ESTSOL_COD_PENDIENTE)){
                this.flagBtnObservar = true;
                this.flagBtnRevisar = true;
            }
        }

        if(this.dto.estado == this.geGenericConst.ESTSOL_COD_EJECUTADA && this.dto.etapa == this.geGenericConst.ETAPASOL_COD_EJECUCION){
            this.flagInfoEjecutar = true;
            this.cuentaDestinoEjecutada = this.dto.cEmpDestinoDto.cuenta + " - (CI:" + this.dto.cEmpDestinoDto.cuentaInter + ")";
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
                this.dto = this.solicitudSocioForm.value;
                this.recuperarValorCalculados();
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
            let valid = true;
            if(this.dto.monedaOrigenDto.id == this.dto.monedaDestinoDto.id){
                valid = false;
            }

            if(!valid){
                this.msgsPrincipal.push({ severity: 'error', summary: 'Mensaje de Error', detail: 'La moneda de origen y destino no pueden ser iguales!' });
                this.displayDialog = true;
            }else{
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
                        .actualizarPorExchange(this.dto)
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

    public recuperarValorCalculados(){
        this.dto.tipoCambioDto = this.tCambioDto;
        this.dto.importeDestino = this.impDestino;
    }

    public formAnularSolicitud(){
        this.dto = this.solicitudSocioForm.value;
        this.recuperarValorCalculados();
        var solicitudes: ExSolicitudDto[] = [];
        solicitudes.push(this.dto);
        this.anularSolicitudes(solicitudes);
    }

    public formObservarSolicitud(){
        this.dto = this.solicitudSocioForm.value;
        this.recuperarValorCalculados();
        var solicitudes: ExSolicitudDto[] = [];
        solicitudes.push(this.dto);
        this.observarSolicitudes(solicitudes);
    }

    public formAbortarSolicitud(){
        this.dto = this.solicitudSocioForm.value;
        this.recuperarValorCalculados();
        var solicitudes: ExSolicitudDto[] = [];
        solicitudes.push(this.dto);
        this.abortarSolicitudes(solicitudes);
    }

    public formRevisarSolicitud(){
        this.dto = this.solicitudSocioForm.value;
        this.recuperarValorCalculados();
        var solicitudes: ExSolicitudDto[] = [];
        solicitudes.push(this.dto);
        this.revisarSolicitudes(solicitudes);
    }

    public anularSolicitudes(solicitudes: ExSolicitudDto[]){
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea anular el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {
                this.service
                    .anular(solicitudes)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            this.displayDialog = false;
                            this.accion = 0;
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.respuesta.emit({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                            this.displayDialog = true;
                        }
                    );
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    public observarSolicitudes(solicitudes: ExSolicitudDto[]){
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea observar el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {
                this.service
                    .observarEnRevision(solicitudes)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            this.displayDialog = false;
                            this.accion = 0;
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.respuesta.emit({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                            this.displayDialog = true;
                        }
                    );
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    public abortarSolicitudes(solicitudes: ExSolicitudDto[]){
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea abortar el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {
                this.service
                    .abortar(solicitudes)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            this.displayDialog = false;
                            this.accion = 0;
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.respuesta.emit({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                            this.displayDialog = true;
                        }
                    );
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    public revisarSolicitudes(solicitudes: ExSolicitudDto[]){
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea revisar el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {
                this.service
                    .revisar(solicitudes)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            this.displayDialog = false;
                            this.accion = 0;
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.respuesta.emit({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                            this.displayDialog = true;
                        }
                    );
            },
            reject: () => {
                //No realiza nada
            }
        });
    }

    public getSocioPorUsuario() {
        let login = this.authService.oauth_token.access_login;
        this.socNegocioService
            .getUsuario(login)
            .subscribe(
                (response: GeMensajeHttpDto) => { this.solicitudSocioForm.controls["socioNegocioDto"].setValue(response.respuesta);},
                error => {
                    this.mostrarError(error);
                }
            );
    }

    public changeTransaccion(){
        var transaccion = this.solicitudSocioForm.controls['transaccion'].value;
        if(this.accion == 2){
            this.tCambioDto = this.dto.tipoCambioDto;
            if(transaccion == "C")
                this.valorTC = this.tCambioDto.precioCompra;
            else
                this.valorTC = this.tCambioDto.precioVenta;
        }else
            this.obtenerTipoCambioCombo();
    }

    public changeBancoOrigen(){
        this.obtenerCuentaEmpresaOrigen();
    }

    public changeMonedaOrigen(){
        this.obtenerTipoCambioCombo();
        this.obtenerCuentaEmpresaOrigen();
    }

    public changeBancoDestino(){
        this.obtenerCuentaSNegocio();
    }

    public changeMonedaDestino(){
        this.obtenerTipoCambioCombo();
        this.obtenerCuentaSNegocio();
    }

    public changeSociNegocio(){
        this.obtenerCuentaSNegocio();
    }

    public onBlurImpOrigen(){
        this.calcularImpDestino();
    }

    public calcularImpDestino(){
        var transaccion = this.solicitudSocioForm.controls['transaccion'].value;
        var tipoCambio = this.tCambioDto;
        var importeOrigen: ExTipoCambioDto = this.solicitudSocioForm.controls['importeOrigen'].value;
        this.impDestino = 0;
        if(isNumeric(importeOrigen) && tipoCambio && tipoCambio.factor != null && transaccion){
            if(transaccion == "C")
                this.impDestino = tipoCambio.precioCompra * importeOrigen;
            else
                this.impDestino = tipoCambio.precioVenta * importeOrigen;
        }
    }

    public obtenerTipoCambioCombo(){
        var banco = this.geGenericConst.paramBancoExExpress;
        var transaccion = this.solicitudSocioForm.controls['transaccion'].value;
        var mOrigen: any = this.solicitudSocioForm.controls['monedaOrigenDto'].value;
        var mDestino: any = this.solicitudSocioForm.controls['monedaDestinoDto'].value;

        if(transaccion && mOrigen && mDestino){
            if (transaccion != this.geGenericConst.filtroSeleccionar.codigo && mOrigen.id != this.geGenericConst.filtroSeleccionar.codigo && mDestino.id != this.geGenericConst.filtroSeleccionar.codigo){
                this.getTipoCambioVigenteCombo(transaccion, banco, mOrigen.id, mDestino.id);
            }else
                this.sitTipoCambio = [];
        }else
            this.sitTipoCambio = [];
    }

    public obtenerCuentaEmpresaOrigen(){
        var banco: any = this.solicitudSocioForm.controls['bancoOrigenDto'].value;
        var moneda: any = this.solicitudSocioForm.controls['monedaOrigenDto'].value;

        if(banco && moneda){
            if (banco.id != this.geGenericConst.filtroSeleccionar.codigo && moneda.id != this.geGenericConst.filtroSeleccionar.codigo){
                this.sitCuentaEmp = this.cEmpresaService.getCuentaEmpresa(banco.id, moneda.id, this.solicitudSocioForm.controls['cEmpOrigenDto']);
            }else
                this.sitCuentaEmp = [];
        }else
            this.sitCuentaEmp = [];
    }

    public obtenerCuentaSNegocio(){
        var socioNegocio: any = this.solicitudSocioForm.controls['socioNegocioDto'].value;
        var banco: any = this.solicitudSocioForm.controls['bancoDestinoDto'].value;
        var moneda: any = this.solicitudSocioForm.controls['monedaDestinoDto'].value;

        if(socioNegocio && banco && moneda){
            if (socioNegocio.id != this.geGenericConst.filtroSeleccionar.codigo && banco.id != this.geGenericConst.filtroSeleccionar.codigo && moneda.id != this.geGenericConst.filtroSeleccionar.codigo){
                this.sitCuentaSocio= this.socNegocioCuentaService.getSocioNegocioCuenta(socioNegocio.id, banco.id, moneda.id, this.solicitudSocioForm.controls['cBancariaDestinoDto']);
            }else
                this.sitCuentaSocio = [];
        }else
            this.sitCuentaSocio = [];
    }

    public getTipoCambioVigenteCombo(transaccion: string,  banco: number, monOrigen: number, monDestino: number) {
        this.tCambioDto = new ExTipoCambioDto();
        this.valorTC = 0;
        this.impDestino = 0;
        this.tipoCambioService.getTipoCambioVigente(banco, monOrigen, monDestino)
            .subscribe((response: GeMensajeHttpDto) => {
                    let tpcDto: ExTipoCambioDto = response.respuesta;
                    if(response!=null){
                        this.tCambioDto = tpcDto;
                        if(transaccion == "C")
                            this.valorTC = this.tCambioDto.precioCompra;
                        else
                            this.valorTC = this.tCambioDto.precioVenta;
                        this.calcularImpDestino();
                    }
                },

                error => console.log(error)
            );
    }
}