import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import {GeGrupoParametroService} from './service'
import {GeGrupoParametroDto} from './model'
import { Router } from '@angular/router';
import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'
import {GeGenericConst} from '../../common/generic.const'
import {Message} from 'primeng/primeng';
import {SelectItem,ConfirmationService} from 'primeng/primeng';

import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";


@Component({
    selector: 'grupoParametroForm',
    providers: [GeGrupoParametroService,GeGenericConst,ConfirmationService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class GeGrupoParametroFormComponent extends GeBaseComponent implements OnInit {

    @Input()
    accion:number = 0;

    @Input() 
    dto: GeGrupoParametroDto;
    

    @Input() 
    displayDialog:boolean;

    @Output() respuesta = new EventEmitter();    

    public msgsPrincipal2: Message[] = [];    
    public sitTiposGrupoParametro:SelectItem[];

    //Validaciones
    grupoForm: FormGroup;

    constructor(router: Router, private service: GeGrupoParametroService,configuration: AppConfiguration, private geGenericConst:GeGenericConst,
                private confirmationService: ConfirmationService, private fb: FormBuilder, auth:AuthService) {
        super('GeGrupoParametroListComponent',router,configuration,auth);

    }

    ngOnInit() {
        this.widthDialog = window.innerWidth*this.configuration.appDialogMin;

        this.grupoForm = this.fb.group({
            'tipo': new FormControl('', Validators.required),
            'nombre': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'comentario': new FormControl('', Validators.maxLength(4000)),
        });
        this.addGenericControls(this.grupoForm);
    }

    getObjectDB() {
        //console.log("DTO SELECCIONADO : " + this.dto.id);
        if (this.dto.id!=null){
            this.service
            .get(this.dto.id)
            .subscribe(
            (response: GeMensajeHttpDto) => { this.dto = response.respuesta;},
            error => { 
                this.mostrarError(error);
            }
            );
        }
        
    }

    /**Evento antes de Mostrar el Modal */
    onBeforeShow(event) {
        this.msgsPrincipal2 = [];
        this.getObjectDB();
        this.sitTiposGrupoParametro = this.geGenericConst.getSitTipoGrupoParametro(1);

        if(this.accion == 2 || this.accion == 4){
            //Si es edicion o clonacion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.grupoForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.grupoForm.reset();
        }
    }

    /**Evento antes de Ocultar el Modal */
    onBeforeHide(event){
        this.displayDialog = false;
        this.accion = 0;        
        this.respuesta.emit({severity:null, summary:null, detail:null, dto: null});
    }
   
    /**Evento al Presionar el Modal */
    public close () {
        this.onBeforeHide(null);
    }

    /**Evento principal para guardar la entidad */
    public save() {       

         this.confirmationService.confirm({
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',            
            accept: () => {
                this.dto = this.grupoForm.value;
                this.saveAlt();
            },
            reject: () => {
                
            }
        });      
    }
    /**Evento para Guardar la Entidad */
    public saveAlt () {    
        //console.log("accion  : " + this.accion);
        this.msgsPrincipal2 = [];
        if(this.accion == 1 || this.accion == 4){
            if (this.accion = 4) //Si es clonacion
                this.dto.id = null;  
            this.service
            .save(this.dto)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.displayDialog = false;
                    this.accion = 0;
                    this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                },
                error => {
                    let errorHttpDto:GeMensajeHttpDto = error;
                    this.msgsPrincipal2.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    this.displayDialog = true;
                }
            );
        }else if(this.accion == 2){//Si es edicion
            this.service
            .update(this.dto)
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.displayDialog = false;
                    this.accion = 0;
                    this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                },
                error => {
                    let errorHttpDto:GeMensajeHttpDto = error;
                    this.msgsPrincipal2.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    this.displayDialog = true;
                }
            );
        }
    }
}
