import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core'
import { ExSolicitudService } from './service'
import { ExSolicitudDto } from './model'
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeSocioNegocioService } from '../../configuracion/GeSocioNegocio/service'
import { ExTipoCambioDto } from '../../exchange/ExTipoCambio/model'
import { ExTipoCambioService } from '../../exchange/ExTipoCambio/service'
import { ExCuentaEmpresaService } from '../../exchange/ExCuentaEmpresa/service'
import { GeSocioNegocioCuentaService } from '../../configuracion/GeSocioNegocioCuenta/service'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import {Observable} from "rxjs";

@Component({
    selector: 'solicitudSocioList',
    providers: [ExSolicitudService, GeMonedaService, GeSocioNegocioService, ExTipoCambioService, GeParametroService, ExCuentaEmpresaService, GeSocioNegocioCuentaService, GeGenericConst, ConfirmationService],
    templateUrl: 'listSocio.html',
    encapsulation: ViewEncapsulation.None
})
export class ExSoliSocioListComponent extends GeBaseComponent implements OnInit{

    public dtoFilter: ExSolicitudDto = new ExSolicitudDto();
    public accion: number = 0;
    public listaDto: ExSolicitudDto[];
    public selectedDtos: ExSolicitudDto[] = []; //Inicializamos en vacio
    public dtoSelect: ExSolicitudDto;
    public sitTipoTransaccion: SelectItem[];
    public tCambioDto: GeSocioNegocioService;
    public sitEtapa: SelectItem[];
    public sitEstado: SelectItem[];
    public sitBanco: SelectItem[];
    public sitCuentaEmp: SelectItem[];
    public sitMoneda: SelectItem[];
    public sitCuentaSocio: SelectItem[];
    public dto: ExSolicitudDto = new ExSolicitudDto();
    public displayDialog: boolean;
    public entidad: number = this.geGenericConst.entSistSolicitud;
    public msgsPrincipal: Message[] = [];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public activeBtnAnular: boolean = false;

    public confirm: boolean = false;
    public id: number;

    constructor(router: Router,
                private service: ExSolicitudService,
                private monedaService: GeMonedaService,
                private tipoCambioService: ExTipoCambioService,
                private parametroService: GeParametroService,
                private cEmpresaService: ExCuentaEmpresaService,
                private socCEmpresa: GeSocioNegocioCuentaService,
                private socNegocioService: GeSocioNegocioService,
                configuration: AppConfiguration,
                private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService){

        super('ExSoliSocioListComponent', router, configuration, auth);
    }

    ngOnInit(){
        this.sitEtapa = this.geGenericConst.getSitEtapaSolicitud();
        this.sitEstado = this.geGenericConst.getSitEstadoSolicitud();
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(dto: ExSolicitudDto): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (dto != null) {
            if (dto.id != null && dto.id + '' != '') { //Si el ID tiene valor
                filtro.filtros.push(new GeFiltroDetaDto('id', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, dto.id + ''));
            }

            if (dto.etapa != null && dto.etapa != (this.geGenericConst.filtroNinguno.codigo + ""))   {
                filtro.filtros.push(new GeFiltroDetaDto('etapa',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,dto.etapa));
            }

            if (dto.estado != null && dto.estado != (this.geGenericConst.filtroNinguno.codigo + ""))   {
                filtro.filtros.push(new GeFiltroDetaDto('estado',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,dto.estado));
            }
        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('fecha', this.geGenericConst.ordAsc));

        return filtro;
    }

    public buscar() {
        this.selectedDtos = []; //limpiamos la seleccion
         this.dto = null;
            this.id = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = false;
            this.activeBtnAnular = false;

        this.service
            .gets(this.crearFiltro(this.dtoFilter))
            .subscribe((response: GeMensajeHttpDto) => {
                    this.listaDto = response.respuesta;
                    console.log();
                },
                error => {
                    this.mostrarError(error);
                }
            );
    }

    private activarBotones() {
        if (this.selectedDtos.length == 0) {
            this.dto = null;
            this.id = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = false;
            this.activeBtnAnular = false;
        } else if (this.selectedDtos.length == 1) {
            for (let x of this.selectedDtos) {
                this.dto = x;
                this.id = x.id;
            }

            this.activeBtnClonar = true;
            this.activeBtnEditar = true;
            this.activeBtnBitacora = true;
            this.activeBtnEliminar = true;
            this.activeBtnAnular = true;
        } else {
            this.dto = null;
            this.id = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = true;
            this.activeBtnAnular = true;
        }
    }

    /**Evento al seleccionar un registro */
    onRowSelect(event) {
        this.activarBotones();
    }

    onRowUnselect(event) {
        this.activarBotones();
    }

    onHeaderCheckboxToggle(event) {
        this.activarBotones();
    }

    public onChangeSelect() {
    }

    /** Invocamos al formulario modal hijo para nuevo*/
    public nuevo() {
        this.accion = 1;
        this.dto = new ExSolicitudDto();
        this.id = null;
        this.displayDialog = true;

    }

    /** Invocamos al formulario modal hijo  para editar*/
    public editar() {
        this.accion = 2;
        this.displayDialog = true;
    }

    /** Invocamos al formulario modal hijo  para clonar*/
    public clonar() {
        this.accion = 4;

        this.displayDialog = true;
    }

    /** Invocamos al modal de bitacora*/
    public bitacora() {
        this.displayBitaDialog = true;
    }

    accConfirm(msg: string, header: string, icon: string) {
        this.confirmationService.confirm({
            message: msg,
            header: header,
            icon: icon,
            accept: () => {
                this.confirm = true;
            }
        });
    }

    /**Evento principal para Eliminar */
    public eliminar() {

        this.confirmationService.confirm({
            message: 'Está seguro que desea eliminar ' + this.selectedDtos.length + ' registros?',
            header: 'Confirmacion',
            accept: () => {
                this.eliminarAlt();
            },
            reject: () => {

            }
        });

        this.accion = 6;
    }

    public eliminarAlt() {
        //this.log('Se confirma eliminacion');
    }

    /** Capturamos la respuesta del hijo (modal)*/
    public respuesta(event) {

        this.accion = 0;
        this.displayDialog = false;
        this.msgsPrincipal = [];
        if (event.severity && event.dto) {
            this.msgsPrincipal.push({ severity: event.severity, summary: event.summary, detail: event.detail });
        }

        this.buscar();
    }

    public formAnularSolicitudes(){
        if(this.selectedDtos && this.selectedDtos.length > 0)
            this.anularSolicitudes(this.selectedDtos);
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
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.msgsPrincipal.push({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario});
                            this.buscar();
                            this.selectedDtos = [];
                            this.activarBotones();
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
}