import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core'
import { GeSocioNegocioService } from './service'
import { GeSocioNegocioDto } from './model'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { GeUbigeoService } from '../../configuracion/GeUbigeo/service'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";

@Component({
    selector: 'socioNegocioList',
    providers: [GeSocioNegocioService, GeParametroService, GeGenericConst, GeUbigeoService, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class GeSocioNegocioListComponent extends GeBaseComponent implements OnInit{
    public dtoFilter: GeSocioNegocioDto = new GeSocioNegocioDto();
    public accion: number = 0;
    public listaDto: GeSocioNegocioDto[];
    public selectedDtos: GeSocioNegocioDto[] = []; //Inicializamos en vacio
    public dtoSelect: GeSocioNegocioDto;
    public sitTipoDocumento: SelectItem[];
    public sitUbigeo: SelectItem[];
    public dto: GeSocioNegocioDto;
    public displayDialog: boolean;
    public msgsPrincipal: Message[] = [];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public confirm: boolean = false;
    public entidad: number = this.geGenericConst.entSistSocioNegocio;
    public id: number;

    constructor(router: Router, 
                private service: GeSocioNegocioService,
                private parametroService: GeParametroService,
                private ubigeoService: GeUbigeoService,
                configuration: AppConfiguration,
                private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService){
        super('GeSocioNegocioListComponent', router, configuration,auth);
    }

    public ngOnInit(){
        this.sitTipoDocumento = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpTipoDoc, 2);
        this.sitUbigeo = this.ubigeoService.getSitUbigeo(2);
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(dto: GeSocioNegocioDto): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (dto != null) {

            if (dto.id != null && dto.id + '' != '') { //Si el ID tiene valor
                filtro.filtros.push(new GeFiltroDetaDto('id', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, dto.id + ''));
            }
            if (dto.nombreCompleto != null && dto.nombreCompleto != '')   {
                filtro.filtros.push(new GeFiltroDetaDto('nombreCompleto',this.geGenericConst.opeLike,this.geGenericConst.tdCaracter.codigo,'%' + dto.nombreCompleto + '%'));
            }
            if (dto.numDocumento != null && dto.numDocumento != '')   {
                filtro.filtros.push(new GeFiltroDetaDto('numDocumento',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,dto.numDocumento));
            }
        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('fechaCreacion', this.geGenericConst.ordAsc));

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
            .gets(this.crearFiltro(this.dtoFilter))
            .subscribe((response: GeMensajeHttpDto) => {
                    this.listaDto = response.respuesta;
                    //console.log();
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
        this.dto = new GeSocioNegocioDto();
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