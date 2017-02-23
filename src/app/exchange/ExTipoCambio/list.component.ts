import { Component, OnInit, ViewEncapsulation, Inject, Pipe } from '@angular/core'
import { ExTipoCambioService } from './service'
import { ExTipoCambioDto } from './model'
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
import {DatePipe} from "@angular/common";
import {isDate} from '../../generic/util/isDate'

@Component({
    selector: 'tipoCambioList',
    providers: [ExTipoCambioService, GeMonedaService, GeParametroService, GeGenericConst, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class ExTipoCambioListComponent extends GeBaseComponent implements OnInit{
    public dtoFilter: ExTipoCambioDto = new ExTipoCambioDto();
    public accion: number = 0;
    public listaDto: ExTipoCambioDto[];
    public selectedDtos: ExTipoCambioDto[] = []; //Inicializamos en vacio
    public dtoSelect: ExTipoCambioDto;
    public sitTipo: SelectItem[];
    public sitMoneda: SelectItem[];
    public sitBanco: SelectItem[];
    public dto: ExTipoCambioDto;
    public displayDialog: boolean;
    public msgsPrincipal: Message[] = [];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public confirm: boolean = false;
    public entidad: number = this.geGenericConst.entSistTipoCambio;
    public id: number;
    es: any;

    constructor(router: Router, 
        private service: ExTipoCambioService,
        private monedaService: GeMonedaService,
        private paramService: GeParametroService,
        configuration: AppConfiguration,
        private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, auth:AuthService) {
        super('ExTipoCambioListComponent', router, configuration, auth);
    }

    ngOnInit() {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ]
        }

        this.sitTipo = this.geGenericConst.getSitTipoCambio(2);
        this.sitMoneda = this.monedaService.getSitMoneda(2);
        this.sitBanco = this.paramService.getSitParametroPorGrupo(this.geGenericConst.grpBanco, 1);
    }

    //Evento para crear el filtro segun los campos llenados.

    public crearFiltro(dto: ExTipoCambioDto): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (dto != null) {
            if (dto.fechaVigencia != null)   {
                var datePipe = new DatePipe("Es");
                var fechaHasta = datePipe.transform(dto.fechaVigencia, "dd/MM/yyyy 23:59:59");
                var fechaDesde = datePipe.transform(dto.fechaVigencia, "dd/MM/yyyy 00:00:00");
                filtro.filtros.push(new GeFiltroDetaDto("fechaVigencia",this.geGenericConst.opeMayEq,this.geGenericConst.tdFecha.codigo, fechaDesde));
                filtro.filtros.push(new GeFiltroDetaDto("fechaVigencia",this.geGenericConst.opeMenEq,this.geGenericConst.tdFecha.codigo, fechaHasta));
            }
            if (dto.bancoDto != null && dto.bancoDto.id != null) {
                if (dto.bancoDto.id != this.geGenericConst.filtroNinguno.codigo && dto.bancoDto.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('bancoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.bancoDto.id+''));
            } 
            if (dto.monedaOrigenDto != null && dto.monedaOrigenDto.id != null) {
                if (dto.monedaOrigenDto.id != this.geGenericConst.filtroNinguno.codigo && dto.monedaOrigenDto.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('monedaOrigenDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.monedaOrigenDto.id+''));
            } 
        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('fechaCreacion', this.geGenericConst.ordAsc));

        return filtro;
    }

    public buscar() {
        var valid = true;
        //Validamos que la fecha ingresada tenga el formato correcto
        if(this.dtoFilter.fechaVigencia){
            valid = isDate(this.dtoFilter.fechaVigencia);
            console.log(valid);
        }
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
            var dtoAux = this.selectedDtos[0];
            this.dto = dtoAux;
            this.id = dtoAux.id;

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
        this.dto = new ExTipoCambioDto();
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