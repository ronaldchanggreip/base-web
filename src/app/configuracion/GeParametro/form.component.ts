import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { GeParametroService } from './service'
import { GeParametroDto } from './model'
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message } from 'primeng/primeng';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { GeGrupoParametroService } from '../GeGrupoParametro/service'
import { GeGrupoParametroDto } from '../GeGrupoParametro/model'
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";
import {OverlayPanel} from "primeng/components/overlaypanel/overlaypanel";


@Component({
    selector: 'parametroForm',
    providers: [GeParametroService, GeGenericConst, ConfirmationService, GeGrupoParametroService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class GeParametroFormComponent extends GeBaseComponent implements OnInit {

    //M001-RCHANG-20161201-Se crea componente GeParametroFormComponent para la logica de la pantalla del formulario de parametros

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: GeParametroDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;


    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];
    public sitGruposParametro: SelectItem[];
    public sitTipoDatoParametro: SelectItem[];

    //validaciones
    parametroForm: FormGroup;

    //Constructor del componente; en este se injectan todos los servicios necesarios
    constructor(router: Router, private service: GeParametroService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
        private confirmationService: ConfirmationService, private serviceGrupo: GeGrupoParametroService, private fb: FormBuilder, auth:AuthService) {
        super('GeParametroListComponent', router, configuration, auth);
    }

    mostrarAuditoria(event, overlaypanel: OverlayPanel) {
        overlaypanel.toggle(event);
    }

    //Primer evento que se ejecuta en automatico luego del constructor
    public ngOnInit() {
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        this.parametroForm = this.fb.group({
            'clave': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
            'descripcion': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500)])),
            'tipoDato': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1)])),
            'valor': new FormControl('', Validators.maxLength(200)),
            'indDefecto': new FormControl('', Validators.nullValidator),
            'descripcionCorta': new FormControl('', Validators.maxLength(50)),
            'codHomologacion': new FormControl('', Validators.maxLength(50)),
            'codEstandar': new FormControl('', Validators.maxLength(50)),
            'grupoDto': new FormControl('', Validators.required),
            'estado': new FormControl('', Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });
        this.addGenericControls(this.parametroForm);
    }
    
    //metodo para recuperar el objeto de la base de datos con el id
    getObjectDB() {
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

    //Evento despues de mostrar el componente modal
    onBeforeShow(event) {
        this.msgsPrincipal = [];
        this.getObjectDB();
        this.sitGruposParametro = this.serviceGrupo.getSitTipoGrupoParametro(1);
        this.sitTipoDatoParametro = this.geGenericConst.getSitTipoDatoParametro2();
        
        if(this.accion == 2 || this.accion == 4){
            //Si es edicion asignamos los valores del dto al FormGroup
            this.service.addValuesControls(this.parametroForm, this.dto);
        }else if(this.accion == 1){
            //Si es nuevo reseteamos los valores del FormGroup
            this.parametroForm.reset();
            this.defaultValuesForm();
        }
    }

    //Evento despues de ocultar el componente modal
    onBeforeHide(event) {
        this.displayDialog = false;
        this.accion = 0;
        this.respuesta.emit({ severity: null, summary: null, detail: null, dto: null });
    }

    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        this.parametroForm.controls["tipoDato"].setValue(this.geGenericConst.tdNinguno.codigo);
        this.parametroForm.controls["indDefecto"].setValue(false);
        this.parametroForm.controls["estado"].setValue(true);
    }

    //Evento despues de cerrar el componente modal (ya sea con la X o con Scape)
    public close() {
        this.onBeforeHide(null);
    }

    //Evento que guarda el registro del componente
    public save() {

        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.parametroForm.value;
                this.saveAlt();
            },
            reject: () => {
                //No realiza nada
            }
        });
    }
    //Evento que guarda el registro en base de datos
    public saveAlt() {
        this.msgsPrincipal = [];
        let grp = new GeGrupoParametroDto();
        grp.id = this.dto.grupoDto.id;
        this.dto.grupoDto = grp;

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
                    this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
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
                    this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                    this.displayDialog = true;
                }
            );
        }
    }
}
