import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {GeInventoService} from './service'
import {GeInventoDto,GeInventoArbolDto} from './model'
import { Router } from '@angular/router';
import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'

import {GeGenericConst} from '../../common/generic.const'
import {GeErrorDto} from '../../generic/error/error.model';
//import {GeActivePipe} from '../../generic/pipes/active.pipe'
import {GeMensajeHttpDto} from "../../generic/error/error.model";

import {Message} from 'primeng/primeng';

import {SelectItem,ConfirmationService, TreeNode} from 'primeng/primeng';
import {AuthService} from "../../seguridad/auth.service";


@Component({
    selector: 'inventoForm',   
    providers: [GeInventoService,GeGenericConst,ConfirmationService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
    
})
export class GeInventoFormComponent extends GeBaseComponent implements OnInit {

    //Arbol
    arbol: TreeNode[]=[];  
    selectArbol: TreeNode;  
    selectDto:GeInventoDto;

    checkBox:boolean = false;

    dtoError:GeMensajeHttpDto;
    displayDialogError:boolean = false;
    

    today:Date = new Date();

    //Autocomplete
    filteredCountriesSingle: GeInventoArbolDto[];
    lstInventosArbol:GeInventoArbolDto[] = [];
    invento:GeInventoArbolDto;

    constructor(router: Router, private service: GeInventoService,configuration: AppConfiguration, private geGenericConst:GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService) {
        super('GeGrupoParametroListComponent',router,configuration, auth);
        
    }



    login () {
        this.service.login('administrador','hviveso').subscribe(
            res=>{
            sessionStorage.setItem('access_token',res.access_token);    
            //console.log(res.access_token) 
            },err=>console.log(err));
    }

    ngOnInit() {            
        this.service.recursividad2(0,this.arbol);
        this.lstInventosArbol = this.service.getsInventarioArbolDto();        
    }

     filterCountrySingle(event) {
        let query = event.query;        
         this.filteredCountriesSingle = this.filterCountry(query,this.lstInventosArbol); 
    }

    filterCountry(query, lstInventosArbol:GeInventoArbolDto[]):GeInventoArbolDto[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered:GeInventoArbolDto[] = [];
        for(let l of lstInventosArbol) {
            
            if(l.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(l);
            }
        }
        return filtered;
    }
        
    /**Seleccionas un node */
    nodeSelect(event) {
        //event.node.label
        this.selectDto = this.selectArbol.data;        
        
    }
    
    /**De seleccionas un node */
    nodeUnselect(event) {
        this.selectDto = this.selectArbol.data;
    }

    accionBotonError() {
      
       /* this.dtoError = new GeErrorDto();
        this.dtoError.capa = 'Servicio';        
        this.dtoError.codigo = 404;
        this.dtoError.desError = 'Esto es un error controlado';
        this.dtoError.desErrorSistema = 'Esto es un error controlado para Sistemas';

        this.displayDialogError = true;*/
    }

     /** Capturamos la respuesta del hijo (modal)*/
    public respuestaError(event) {                
        this.displayDialogError = false;
        this.dtoError = null;
    }
}
