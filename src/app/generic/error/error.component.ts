import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'

import {GeMensajeHttpDto} from './error.model'
import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'
import {GeGenericConst} from '../../common/generic.const'

import { Router } from '@angular/router';
import {AuthService} from "../../seguridad/auth.service";


@Component({
    selector: 'errorForm',
    providers: [GeGenericConst],
    templateUrl: 'error.html',
    encapsulation: ViewEncapsulation.None
})
export class GeErrorComponent extends GeBaseComponent implements OnInit {


    @Input("dtoError")
    dtoError: GeMensajeHttpDto = new GeMensajeHttpDto(0,"","","","","");

    @Input("displayDialogError")
    displayDialogError: boolean = false;

    @Output() respuesta = new EventEmitter();    



    constructor(router: Router, configuration: AppConfiguration, private geGenericConst: GeGenericConst, auth:AuthService) {
        super('GeErrorComponent', router, configuration, auth);
    }

    ngOnInit() {
        this.widthDialog = window.innerWidth*this.configuration.appDialogMin;
        //console.log("Entra al ngOnInit");
        //this.displayDialogError = true;
    }

    /**Evento antes de Mostrar el Modal */
    onBeforeShow(event) {
        
    
    }

    /**Evento antes de Ocultar el Modal */
    onBeforeHide(event) {
        this.displayDialogError = false;
        this.respuesta.emit({severity:null, summary:null, detail:null, dtoError: null});
        // this.accion = 0;        
        //this.respuesta.emit({severity:null, summary:null, detail:null, dto: null});
    }

    /**Evento al Presionar el Modal */
    public close() {
        this.onBeforeHide(null);        
    }



}
