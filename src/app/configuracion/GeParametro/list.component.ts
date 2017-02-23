import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core'
import { GeParametroService } from './service'
import { GeGrupoParametroService } from '../GeGrupoParametro/service'
import { GeGrupoParametroDto } from '../GeGrupoParametro/model'
import { GeParametroDto } from './model'
import { Router } from '@angular/router';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeFiltroDto,GeFiltroDetaDto,GeFiltroOrderDto } from '../../common/generic.model.filtro'
import { GeGenericConst } from '../../common/generic.const'
import { Message, SelectItem, ConfirmationService } from 'primeng/primeng';
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";


@Component({
    selector: 'parametroList',
    providers: [GeParametroService, GeGenericConst, ConfirmationService, GeGrupoParametroService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class GeParametroListComponent extends GeBaseComponent implements OnInit {
    //M001-RCHANG-20161201-Se crea componente GeParametroListComponent para la logica de la pantalla de Gestion de Parametros


    public dtoFilter: GeParametroDto = new GeParametroDto(); //Dto para el filtro de busqueda en la pantalla
    public dtoFiltroDto: GeFiltroDto; //Filtro a enviar a la api para consultar
    public accion: number = 0; // accion a realizar
    public listaDto: GeParametroDto[]; //lista o arreglo de Dtos para mostrar en la grilla
    public selectedDtos: GeParametroDto[] = []; //lista o arreglo para almacenar los registros seleccionados de la grilla
    public entidad: number = this.geGenericConst.entSistParametro;

    public dto: GeParametroDto; //dto para el formulario
    public displayDialog: boolean; //flag para mostrar o ocultar el formulario de la entidad
    public msgsPrincipal: Message[] = []; //Mensaje para la pantalla
    public sitGruposParametro: SelectItem[]; //Arreglo de SelectItem para los grupos de parametros

    public activeBtnClonar: boolean = false; //variable para mostrar o ocultar el boton Clonar
    public activeBtnEditar: boolean = false; //variable para mostrar o ocultar el boton Editar
    public activeBtnBitacora: boolean = false; //variable para mostrar o ocultar el boton Bitacora
    public activeBtnEliminar: boolean = false; //variable para mostrar o ocultar el boton Eliminar
    public confirm: boolean = false; //variable para almacenar el valor del mensaje de confirmacion
    public id: number;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router,
        private serviceGrupo: GeGrupoParametroService,
        private service: GeParametroService,
        configuration: AppConfiguration,
        private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, auth:AuthService
    ) {
        super('GeParametroListComponent', router, configuration,auth);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    ngOnInit() {
        
        //this.buscar();
        this.dtoFilter = this.service.newObject();
        this.dtoFilter.grupoDto = this.serviceGrupo.newObject();
        this.sitGruposParametro = this.serviceGrupo.getSitTipoGrupoParametro(2);
    }

    //Evento para crear el filtro segun los campos llenados.
    public crearFiltro(dto:GeParametroDto):GeFiltroDto{
        let filtro:GeFiltroDto = new GeFiltroDto();
        
        if (dto!=null) {
            
            if (dto.id != null && dto.id+'' != '') { //Si el ID tiene valor
                filtro.filtros.push(new GeFiltroDetaDto('id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.id + ''));
            }
            if (dto.descripcion != null && dto.descripcion != '')   {
                filtro.filtros.push(new GeFiltroDetaDto('descripcion',this.geGenericConst.opeLike,this.geGenericConst.tdCaracter.codigo,'%'+dto.descripcion+'%'));
            }

            if (dto.grupoDto != null && dto.grupoDto.id != null) {
                if (dto.grupoDto.id != this.geGenericConst.filtroNinguno.codigo && dto.grupoDto.id != this.geGenericConst.filtroSeleccionar.codigo)
                    filtro.filtros.push(new GeFiltroDetaDto('grupoDto.id',this.geGenericConst.opeEq,this.geGenericConst.tdEntero.codigo,dto.grupoDto.id+''));
            }            
        }
        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('grupoDto.id',this.geGenericConst.ordAsc));
        filtro.orders.push(new GeFiltroOrderDto('descripcion',this.geGenericConst.ordAsc));

        return filtro;
    }

    //Buscar entidades
    public buscar() {
        //this.log(JSON.stringify(this.crearFiltro(this.dtoFilter)));
        this.selectedDtos = []; //limpiamos la seleccion
        this.service
            .gets(this.crearFiltro(this.dtoFilter))
            .subscribe(
            (response: GeMensajeHttpDto) => {
                this.listaDto = response.respuesta;
                //this.log(response)
            },
            error => { 
                this.mostrarError(error);
            }
            );
    }
    
    //Logica para activar o desactivar botones
    private activarBotones() {
        //Si la lista que contiene los registros seleccionados no tiene registros
        if (this.selectedDtos.length == 0) {
            this.dto = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = false;
        } else if (this.selectedDtos.length == 1) {//Si la lista que contiene los registros seleccionados tiene 01 registro
            for (let x of this.selectedDtos) {
                this.dto = x;
                this.id = x.id;
            }

            this.activeBtnClonar = true;
            this.activeBtnEditar = true;
            this.activeBtnBitacora = true;
            this.activeBtnEliminar = true;

        } else { //Si la lista que contiene los registros seleccionados tiene mas de un registro
            this.dto = null;
            this.activeBtnClonar = false;
            this.activeBtnEditar = false;
            this.activeBtnBitacora = false;
            this.activeBtnEliminar = true;
        }
    }


    //Evento que se activa al seleccionar un registro de la lista
    public onRowSelect(event) {
        this.activarBotones();
    }

    //Evento que se activa al des seleccionar un registro de la lista
    public onRowUnselect(event) {
        this.activarBotones();
    }

    //Evento que se activa al seleccionar el check de seleccionar o deseleccionar todos
    public onHeaderCheckboxToggle(event) {
        this.activarBotones();
    }


    //Mostramos el formulario para crear una nueva entidad
    public nuevo() {
        //this.log('Entra nuevo')
        this.accion = 1;
        this.dto = this.service.newObject();
        this.displayDialog = true;
        //this.activarBotones();

    }

    //Mostramos el formulario para crear una editar entidad
    public editar() {
        this.accion = 2;
        this.displayDialog = true;
        this.activarBotones();
    }

    //Mostramos el formulario para crear una clonar entidad
    public clonar() {
        this.accion = 4;
        this.displayDialog = true;
        this.activarBotones();
    }

    //Mostramos el formulario para crear una bitacora entidad
    public bitacora() {
        this.displayBitaDialog = true;
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

    //Evento para recuperar la respuesta del Formulario Hijo 
    public respuesta(event) {
        this.accion = 0;
        this.displayDialog = false;
        this.msgsPrincipal = [];
        if (event.severity && event.dto) {
            this.msgsPrincipal.push({ severity: event.severity, summary: event.summary, detail: event.detail });
        }
        this.buscar();//Volvemos a invocar el evento buscar para que recarge los cambios
    }
}
