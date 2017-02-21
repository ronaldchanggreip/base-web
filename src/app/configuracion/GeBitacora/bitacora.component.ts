import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {GeBitacoraService} from './service'
import { Router } from '@angular/router';
import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'
import {GeGenericConst} from '../../common/generic.const'
import {Message} from 'primeng/primeng';
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import {SelectItem,ConfirmationService} from 'primeng/primeng';
import {GeBitacoraDto} from "./model";
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'

@Component({
    selector: 'bitacoraList',
    providers: [GeBitacoraService,GeGenericConst,ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None
})
export class GeBitacoraListComponent extends GeBaseComponent implements OnInit{
    @Input()
    entidad:number = 0;

    @Input()
    registro:number;

    @Input()
    displayDialog:boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    public listaDto: GeBitacoraDto[] = [];

    constructor(router: Router, private service: GeBitacoraService,configuration: AppConfiguration, private geGenericConst:GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService) {
        super('GeBitacoraListComponent',router,configuration,auth);
    }

    public ngOnInit(){
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
    }

    public crearFiltro(): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        filtro.filtros.push(new GeFiltroDetaDto('registro', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, this.registro + ''));
        filtro.filtros.push(new GeFiltroDetaDto('entidadDto.id', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, this.entidad + ''));

        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('fecha', this.geGenericConst.ordAsc));

        return filtro;
    }

    /**Evento antes de Mostrar el Modal */
    onBeforeShow(event) {
        this.buscar();
    }

    /**Evento antes de Ocultar el Modal */
    onBeforeHide(event){
        this.displayDialog = false;
        this.respuesta.emit(null);
    }

    /**Evento al Presionar el Modal */
    public close () {
        this.onBeforeHide(null);
    }

    public buscar() {
        this.service
            .gets(this.crearFiltro())
            .subscribe((response: GeMensajeHttpDto) => {
                    this.listaDto = response.respuesta;
                },
                error => {
                    //console.log(error);
                    this.mostrarError(error);
                }
            );
    }
}