import {Component, OnInit, ViewEncapsulation, AfterViewInit, OnChanges} from '@angular/core'
import { Router,CanActivate } from '@angular/router';
import {GeBaseComponent} from '../../app/common/base.component';
import {AppConfiguration} from '../../app/common/app.configuration';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AuthService} from "../seguridad/auth.service";
import {GeGenericConst} from "../common/generic.const";


@Component({
    selector: 'home',
    templateUrl: 'home.html',
     providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, GeGenericConst ],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent extends GeBaseComponent implements OnInit, AfterViewInit,OnChanges{
    location: Location;
    displayDialogLogin:boolean;



    /*--10001 sole
    --10002 dolares
    --10004 euro*/

    constructor(location: Location,router: Router,configuration: AppConfiguration, auth:AuthService, private cons:GeGenericConst ) {
        super('HomeComponent',router,configuration, auth);

    }



    ngOnChanges(){

    }

    ngOnInit() {
       // this.cargarInformacionDeCambio();
    }


    ngAfterViewInit(){

    }






    public goLogin(event) {
        this.displayDialogLogin = true;
    }

    /** Capturamos la respuesta del hijo (modal)*/
    public respuestaLogin(event) {
        this.displayDialogLogin = false;
    }


}
