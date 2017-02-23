import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core'
import { ExCuentaEmpresaService } from './service'
import { ExCuentaEmpresaDto } from './model'
import { GeMonedaService } from '../../configuracion/GeMoneda/service'
import { GeParametroService } from '../../configuracion/GeParametro/service'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";
import { GeMensajeHttpDto } from '../../generic/error/error.model'

@Component({
    selector: 'cuentaEmpresaList',
    providers: [ExCuentaEmpresaService, GeMonedaService, GeParametroService, GeGenericConst, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class ExCuentaEmpresaListComponent extends GeBaseComponent implements OnInit{
    public dtoFilter: ExCuentaEmpresaDto = new ExCuentaEmpresaDto();
    public accion: number = 0;
    public listaDto: ExCuentaEmpresaDto[];
    public selectedDtos: ExCuentaEmpresaDto[] = []; //Inicializamos en vacio
    public dtoSelect: ExCuentaEmpresaDto;
    public sitBanco: SelectItem[];
    public sitMoneda: SelectItem[];
    public dto: ExCuentaEmpresaDto;
    public displayDialog: boolean;
    public msgsPrincipal: Message[] = [];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public confirm: boolean = false;
    public id: number;

    constructor(router: Router, 
        private service: ExCuentaEmpresaService,
        private monedaService: GeMonedaService,
        private parametroService: GeParametroService,
        configuration: AppConfiguration,
        private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, auth:AuthService) {
        super('ExCuentaEmpresaListComponent', router, configuration,auth);
    }

    ngOnInit() {
        this.sitBanco = this.parametroService.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 2);
        this.sitMoneda = this.monedaService.getSitMoneda(2);
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(dto: ExCuentaEmpresaDto): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (dto != null) {
            if (dto.cuenta != null && dto.cuenta != '')   {
                filtro.filtros.push(new GeFiltroDetaDto('cuenta',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,dto.cuenta));
            }
            if (dto.cuentaInter != null && dto.cuentaInter != '')   {
                filtro.filtros.push(new GeFiltroDetaDto('cuentaInter',this.geGenericConst.opeEq,this.geGenericConst.tdCaracter.codigo,dto.cuentaInter));
            }
            if (dto.bancoDto != null && dto.bancoDto.id != null) {
                if (dto.bancoDto.id != this.geGenericConst.filtroNinguno.codigo && dto.bancoDto.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('bancoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.bancoDto.id+''));
            } 
            if (dto.monedaDto != null && dto.monedaDto.id != null) {
                if (dto.monedaDto.id != this.geGenericConst.filtroNinguno.codigo && dto.monedaDto.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('monedaDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.monedaDto.id+''));
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
        this.dto = new ExCuentaEmpresaDto();
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