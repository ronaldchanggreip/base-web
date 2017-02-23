import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core'
import { GeSocioNegocioCuentaService } from './service'
import { GeSocioNegocioCuentaDto } from './model'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeSocioNegocioService } from '../../configuracion/GeSocioNegocio/service'
import { GeSocioNegocioDto } from '../../configuracion/GeSocioNegocio/model'
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";
import { GeMensajeHttpDto } from '../../generic/error/error.model'

@Component({
    selector: 'socioNegocioCuentaList',
    providers: [GeSocioNegocioCuentaService, GeSocioNegocioService, GeMonedaService, GeParametroService, GeGenericConst, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})

export class GeSocioNegocioCuentaListComponent extends GeBaseComponent implements OnInit{
    public dtoFilter: GeSocioNegocioCuentaDto = new GeSocioNegocioCuentaDto();
    public accion: number = 0;
    public listaDto: GeSocioNegocioCuentaDto[];
    public selectedDtos: GeSocioNegocioCuentaDto[] = []; //Inicializamos en vacio
    public dtoSelect: GeSocioNegocioCuentaDto;
    public sitBanco: SelectItem[];
    public sitMoneda: SelectItem[];
    public dto: GeSocioNegocioCuentaDto;
    public displayDialog: boolean;
    public msgsPrincipal: Message[] = [];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public confirm: boolean = false;
    public id: number;

    @Input() //Variable de entrada cuando se invocara a este componente
    dtoSocio: GeSocioNegocioDto;

    constructor(router: Router, 
                private service: GeSocioNegocioCuentaService,
                private parametroService: GeParametroService,
                private monedaService: GeMonedaService,
                private sNegocioService: GeSocioNegocioService,
                configuration: AppConfiguration,
                private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService){
        super('GeSocioNegocioCuentaListComponent', router, configuration, auth);
    }

    public ngOnInit(){
        this.sitBanco = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 2);
        this.sitMoneda = this.monedaService.getSitMoneda(2);
        this.buscar();
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (this.dtoSocio != null) {
            if (this.dtoSocio != null && this.dtoSocio.id != null) {
                if (this.dtoSocio.id != this.geGenericConst.filtroNinguno.codigo && this.dtoSocio.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('socioNegocioDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,this.dtoSocio.id+''));
            } 
        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('id', this.geGenericConst.ordDes));

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

        this.service
            .gets(this.crearFiltro())
            .subscribe((response: GeMensajeHttpDto) => {
                    this.listaDto = response.respuesta;
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
        } else if (this.selectedDtos.length == 1) {
            for (let x of this.selectedDtos) {
                this.dto = x;
                this.id = x.id;
            }

            this.activeBtnClonar = true;
            this.activeBtnEditar = true;
            this.activeBtnBitacora = true;
            this.activeBtnEliminar = true;
        } else {
            this.dto = null;
            this.id = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = true;
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
        this.dto = new GeSocioNegocioCuentaDto();
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
        this.accion = 5;
        this.displayDialog = true;
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

    //Evento para eliminar un registro o muchos registros
    public eliminar() {
        this.accion = 3;
        this.activarBotones();

        //Muestra mensaje de confirmacion
        this.confirmationService.confirm({
            message: 'Está seguro que desea eliminar ' + this.selectedDtos.length + ' registros?',
            header: 'Confirmacion',
            accept: () => {
                var ids: number[] = [];
                for(let obj of this.selectedDtos){
                    ids.push(obj.id);
                }
                this.eliminarAlt(ids); //Invocamos el proceso que elimina invocando el servicio
            },
            reject: () => {
                // no realiza nada
            }
        });

        this.accion = 6;
    }

    //Evento que elimina todos los registros seleccionados
    private eliminarAlt(ids: number[]) {
        this.service
            .deleteLogico(ids)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.buscar();
                    this.msgsPrincipal.push({ severity: 'success', summary: 'Mensaje de conformidad', detail: response.mensajeUsuario });
                },
                error => { this.mostrarError(error); }
            );
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
}