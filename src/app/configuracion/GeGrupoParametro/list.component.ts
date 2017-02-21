import {Component, OnInit, ViewEncapsulation, Inject, OnChanges} from '@angular/core'
import { GeGrupoParametroService } from './service'
import { GeGrupoParametroDto } from './model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import {GeErrorDto, GeMensajeHttpDto} from '../../generic/error/error.model';
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'
import {AuthService} from "../../seguridad/auth.service";


@Component({
    selector: 'grupoParametroList',
    providers: [GeGrupoParametroService, GeGenericConst, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class GeGrupoParametroListComponent extends GeBaseComponent implements OnInit {

    public dtoFilter: GeGrupoParametroDto = new GeGrupoParametroDto();
    public accion: number = 0;
    public listaDto: GeGrupoParametroDto[];
    public selectedDtos: GeGrupoParametroDto[] = []; //Inicializamos en vacio
    public dtoSelect: GeGrupoParametroDto;
    public dto: GeGrupoParametroDto;
    public displayDialog: boolean;
    public msgsPrincipal: Message[] = [];
    public sitTiposGrupoParametro: SelectItem[];
    public activeBtnClonar: boolean = false;
    public activeBtnEditar: boolean = false;
    public activeBtnBitacora: boolean = false;
    public activeBtnEliminar: boolean = false;
    public confirm: boolean = false;
    public id: number;


    constructor(router: Router, private service: GeGrupoParametroService,
        configuration: AppConfiguration,
        private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, auth:AuthService) {
        super('GeGrupoParametroListComponent', router, configuration,auth);


    }


    ngOnInit() {
        //this.validarToken();
        //this.auth.checkToken(sessionStorage.getItem("access_token"));
        //this.buscar();
        //this.listaDto = this.service.getsDtos(this.dtoFilter);
        this.sitTiposGrupoParametro = this.geGenericConst.getSitTipoGrupoParametro(2);
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(dto: GeGrupoParametroDto): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        if (dto != null) {

            if (dto.id != null && dto.id + '' != '') { //Si el ID tiene valor
                filtro.filtros.push(new GeFiltroDetaDto('id', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, dto.id + ''));
            }
            if (dto.nombre != null && dto.nombre != '') {
                filtro.filtros.push(new GeFiltroDetaDto('nombre', this.geGenericConst.opeLike, this.geGenericConst.tdCaracter.codigo, '%' + dto.nombre + '%'));
            }
            if (dto.tipo != null && dto.tipo != '' && dto.tipo != this.geGenericConst.filtroNinguno.codigo+'' && dto.tipo != this.geGenericConst.filtroSeleccionar.codigo+'') {
                filtro.filtros.push(new GeFiltroDetaDto('tipo', this.geGenericConst.opeEq, this.geGenericConst.tdCaracter.codigo, dto.tipo));
            }

        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('nombre', this.geGenericConst.ordAsc));

        return filtro;
    }

    public buscar() {
        // Se debe implementar el metodo para filtrar
        // this.log('Entra metodo buscar')
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
            },
            error => {
                //console.log(error);
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
        this.dto = this.service.newObject();
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
        //     this.log('Se confirma eliminacion');
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
