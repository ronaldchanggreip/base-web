import {Component, OnInit, ViewEncapsulation, AfterViewInit, OnChanges} from '@angular/core'
import { Router,CanActivate } from '@angular/router';
import {GeBaseComponent} from '../../app/common/base.component';
import {AppConfiguration} from '../../app/common/app.configuration';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AuthService} from "../seguridad/auth.service";
import {ExTipoCambioService} from "../exchange/ExTipoCambio/service";
import {ExTipoCambioDto} from "../exchange/ExTipoCambio/model";
import {GeGenericConst} from "../common/generic.const";


@Component({
    selector: 'home',
    templateUrl: 'home.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, ExTipoCambioService, GeGenericConst ],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent extends GeBaseComponent implements OnInit, AfterViewInit,OnChanges{
    location: Location;
    displayDialogLogin:boolean;

    dlgCaluladoraDisplay: boolean;
    dlgCalculadoraTipoCambioDto: ExTipoCambioDto;
    dlgCalculadoraTipo:string;
    dlgCalculadoraMoneda:string;

    tcsDolares:ExTipoCambioDto[];
    tcsEuros:ExTipoCambioDto[];


    tcDolares: ExTipoCambioDto = new ExTipoCambioDto();
    tcEuros: ExTipoCambioDto = new ExTipoCambioDto();
    tcDolaresExiste:boolean;
    tcEurosExiste:boolean;

    /*--10001 sole
     --10002 dolares
     --10004 euro*/

    constructor(location: Location,router: Router,configuration: AppConfiguration, auth:AuthService,private serviceTipoCambio: ExTipoCambioService, private cons:GeGenericConst ) {
        super('HomeComponent',router,configuration, auth);

    }

    cargarInformacionDeCambio(){
        let fecha: Date = new Date();

        this.serviceTipoCambio.getExchangeDolar(fecha).subscribe(res=> {
            this.tcDolares = res.respuesta;
        }, err=> {
            this.tcDolares = null;
        },()=>{
            //
        });


        this.serviceTipoCambio.getExchangeEuro(fecha).subscribe(res=> {
            this.tcEuros = res.respuesta;
        }, err=> {this.tcEuros = null;
        },()=>{

        });

        this.serviceTipoCambio.getsPorFechaDolares(fecha).subscribe(res=> {
            this.tcsDolares = res.respuesta;
        }, err=> {this.tcsDolares = null;},()=>{
            //
        });

        this.serviceTipoCambio.getsPorFechaEuros(fecha).subscribe(res=> {
            this.tcsEuros = res.respuesta;
        }, err=> {this.tcsEuros = null;},()=>{
            //
        });
    }

    ngOnChanges(){

    }

    ngOnInit() {
        this.cargarInformacionDeCambio();
    }

    ngAfterViewInit(){

    }



    calComprarDolares() {
        //console.log("calComprarDolares")
        if (this.tcDolares!= null) {
            this.dlgCaluladoraDisplay = true;
            this.dlgCalculadoraTipo = 'C';
            this.dlgCalculadoraMoneda = 'Dolares';
            this.dlgCalculadoraTipoCambioDto = this.tcDolares;
        }

    }

    calVentaDolares() {
        //console.log("calComprarDolares")
        if (this.tcDolares!= null) {
            this.dlgCaluladoraDisplay = true;
            this.dlgCalculadoraTipo = 'V';
            this.dlgCalculadoraMoneda = 'Dolares';
            this.dlgCalculadoraTipoCambioDto = this.tcDolares;
        }
    }

    calComprarEuros() {
        //console.log("calComprarDolares")
        if (this.tcEuros!= null) {
            this.dlgCaluladoraDisplay = true;
            this.dlgCalculadoraTipo = 'C';
            this.dlgCalculadoraMoneda = 'Euros';
            this.dlgCalculadoraTipoCambioDto = this.tcEuros;
        }
    }

    calVentaEuros() {
        //console.log("calComprarDolares")
        if (this.tcEuros!= null) {
            this.dlgCaluladoraDisplay = true;
            this.dlgCalculadoraTipo = 'V';
            this.dlgCalculadoraMoneda = 'Euros';
            this.dlgCalculadoraTipoCambioDto = this.tcEuros;
        }
    }



    public goLogin(event) {
        this.displayDialogLogin = true;
    }

    /** Capturamos la respuesta del hijo (modal)*/
    public respuestaLogin(event) {
        this.displayDialogLogin = false;
    }

    //Metodo publico para capturar la respuesta de error de un componente hijo (Modal)
    public dlgCalculadoraRespuesta(event) {
        this.dlgCaluladoraDisplay = false;


    }

}