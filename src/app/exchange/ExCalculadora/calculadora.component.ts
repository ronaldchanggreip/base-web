import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'

import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'
import {GeGenericConst} from '../../common/generic.const'

import { Router } from '@angular/router';
import {AuthService} from "../../seguridad/auth.service";
import {ExTipoCambioDto} from "../ExTipoCambio/model";


@Component({
    selector: 'calculadora',
    providers: [GeGenericConst],
    templateUrl: 'calculadora.html',
    encapsulation: ViewEncapsulation.None
})
export class ExCalculadoraComponent extends GeBaseComponent implements OnInit {


    @Input("tipoCambioDto")
    dto: ExTipoCambioDto= new ExTipoCambioDto();

    @Input("tipo")
    tipo: string; //Tipo de Transaccion Compra y/o Venta

    @Input("moneda")
    moneda: string; //Tipo de Transaccion Compra y/o Venta

    @Input("displayDialog")
    displayDialog: boolean = false;

    @Output() respuesta = new EventEmitter();

    titulo:string;
    factor:number;
    monto:number = 1;
    resultado:number = 0;



    constructor(router: Router, configuration: AppConfiguration, private geGenericConst: GeGenericConst, auth:AuthService) {
        super('ExCalculadoraComponent', router, configuration, auth);
    }

    ngOnInit() {
        this.widthDialog = 250;


        //console.log("Entra al ngOnInit");
        //this.displayDialogError = true;
    }

    /**Evento antes de Mostrar el Modal */
    onBeforeShow(event) {
        //console.log(this.tipo + " "+ this.moneda + " " + this.dto)
        if (this.tipo==this.geGenericConst.tcCompra.codigo) {
            this.titulo = this.geGenericConst.tcCompra.descripcion + " " + this.moneda;
            this.factor = this.dto.precioCompra;
        }else if (this.tipo==this.geGenericConst.tcTVenta.codigo) {
            this.titulo = this.geGenericConst.tcTVenta.descripcion + " " + this.moneda;
            this.factor = this.dto.precioVenta;
        }
        this.monto= 1;
        this.calResultado(event);
    
    }

    calResultado(event) {
        this.resultado = this.factor * this.monto;
    }


    /**Evento antes de Ocultar el Modal */
    onBeforeHide(event) {
        this.displayDialog = false;
        this.respuesta.emit({severity:null, summary:null, detail:null});
        // this.accion = 0;        
        //this.respuesta.emit({severity:null, summary:null, detail:null, dto: null});
    }

    /**Evento al Presionar el Modal */
    public close() {
        this.onBeforeHide(null);        
    }



}
