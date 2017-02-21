import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core'
import { SeRolService } from './service'
import { SeRolDto } from './model'
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GeBaseComponent } from '../../common/base.component';
import { AppConfiguration } from '../../common/app.configuration'
import { GeGenericConst } from '../../common/generic.const'
import { Message, PasswordModule, InputSwitchModule } from 'primeng/primeng';
import { SelectItem, ConfirmationService, TreeModule,TreeNode} from 'primeng/primeng';
import { GeMensajeHttpDto } from '../../generic/error/error.model'
import { ValidationService } from '../../generic/validaciones/validation.service'
import {AuthService} from "../../seguridad/auth.service";
import {SeOpcionService} from "../SeOpcion/service";

@Component({
    selector: 'rolForm',
    providers: [SeRolService, SeOpcionService, GeGenericConst, ConfirmationService],
    templateUrl: 'form.html',
    encapsulation: ViewEncapsulation.None
})
export class SeRolFormComponent extends GeBaseComponent implements OnInit{
    //M001-HVIVES-20170217-Se crea componente SeRolFormComponent para la logica de la pantalla del formulario de roles

    @Input() //Variable de entrada cuando se invocara a este componente
    accion: number = 0;

    @Input() //Variable de entrada cuando se invocara a este componente
    dto: SeRolDto;

    @Input() //Variable de entrada cuando se invocara a este componente
    displayDialog: boolean;

    @Output() //Variable de salida cuando se sale de este componente
    respuesta = new EventEmitter();

    //Mensaje en este componente
    public msgsPrincipal: Message[] = [];

    public tree: TreeNode[];

    public selectedTree: TreeNode[];

    public strSelected: string[] = [];

    public selectedTreeLoad: any;

    public sitEstado: SelectItem[] = [];

    //Validaciones
    rolForm: FormGroup;

    constructor(router: Router, private service: SeRolService, private rolService: SeRolService, private opcionService: SeOpcionService, configuration: AppConfiguration, private geGenericConst: GeGenericConst,
                private confirmationService: ConfirmationService, private fb: FormBuilder, auth:AuthService) {
        super('SeRolFormComponent', router, configuration,auth);
    }

    public ngOnInit(){
        this.rolForm = this.fb.group({
            'nombre': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'indAdministrador': new FormControl(Validators.nullValidator),
            'indSys': new FormControl(Validators.nullValidator),
            'estado': new FormControl(Validators.nullValidator),
            'comentario': new FormControl('', Validators.maxLength(4000))
        });

        this.addGenericControlsNoObj(this.rolForm);
    }

    //metodo para recuperar el objeto de la base de datos con el id
    getObjectDB() {
        if (this.dto.id!=null){
            this.service
                .get(this.dto.id)
                .subscribe(
                    (response: GeMensajeHttpDto) => { this.dto = response.respuesta;
                        if(this.accion == 2 || this.accion == 4){
                            this.selectedTreeLoad = this.dto.treeWebSelected;
                            //Si es edicion asignamos los valores del dto al FormGroup
                            this.service.addValuesControls(this.rolForm, this.dto);
                            this.getOpciones();
                        }
                    },
                    error => {
                        this.mostrarError(error);
                    }
                );
        }
    }

    getOpciones(){
        this.opcionService
            .getArbolWeb()
            .subscribe(
                (response: GeMensajeHttpDto) => {
                    this.tree = response.respuesta;
                    if(this.accion == 2)
                        this.recuperarNodosSeleccionados();
                },
                error => {
                    this.mostrarError(error);
                }
            );
    }

    //Evento despues de mostrar el componente modal
    onBeforeShow(event) {
        this.msgsPrincipal = [];
        this.sitEstado = this.geGenericConst.getSitEstadoActivInactiv(1);
        this.getObjectDB();
        if(this.accion == 1){
            this.getOpciones();
            //Si es nuevo reseteamos los valores del FormGroup
            this.rolForm.reset();
            this.selectedTree = [];
            this.defaultValuesForm();
        }
    }

    //Evento despues de ocultar el componente modal
    onBeforeHide(event) {
        this.displayDialog = false;
        this.accion = 0;
        this.respuesta.emit({ severity: null, summary: null, detail: null, dto: null });
    }

    public nodeSelect(event) {
        console.log("seleccionados : ", this.selectedTree);
    }

    //Evento despues de cerrar el componente modal (ya sea con la X o con Scape)
    public close() {
        this.onBeforeHide(null);
    }

    public recuperarNodosSeleccionados(){
        var nodosLoad: any[] = [];
        if(this.selectedTreeLoad){
            for(let nLoad of this.selectedTreeLoad){
                let retorno = this.buscarNodo(nLoad);
                if(retorno)
                nodosLoad.push(retorno);
            }
        }
        this.selectedTree = nodosLoad;
    }

    private buscarNodo(nLoad: any){
        var retorno: any = null;
        this.tree.forEach( node => {

            if(node.data == nLoad.data){
                retorno = node;
                return;
            }
            else {
                if(node.children){
                    node.children.forEach( childNode => {
                        if(childNode.data == nLoad.data){
                            retorno = childNode;
                            return;
                        }
                    } );
                }
            }
        } );
        return retorno;
    }

    //Metodo que inicializa los valores de algunos campos del formulario
    public defaultValuesForm(){
        this.rolForm.controls["indAdministrador"].setValue(false);
        this.rolForm.controls["indSys"].setValue(false);
        this.rolForm.controls["estado"].setValue("A");
    }

    public save() {
        this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea guardar el registro?',
            header: 'Confirmacion',
            accept: () => {
                this.dto = this.rolForm.value;
                this.strSelected = [];
                for(let op of this.selectedTree){
                    this.strSelected.push(op.data);
                }
                this.dto.opciones = this.strSelected;
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
        let valid = true;

        if (valid) {
            if (this.accion == 1 || this.accion == 4) {
                if (this.accion = 4) //Si es clonacion
                    this.dto.id = null;
                this.service
                    .save(this.dto)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            if (response.codigoHttp == this.geGenericConst.codErrorValidacion200) {
                                this.msgsPrincipal.push({severity: 'error', summary: "Mensaje de validación", detail: response.mensajeUsuario});
                            } else {
                                this.displayDialog = false;
                                this.accion = 0;
                                this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                            }
                        },
                        error => {
                            let errorHttpDto: GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp});
                            this.displayDialog = true;
                        }
                    );
            } else if (this.accion == 2) {//Si es edicion
                this.service
                    .update(this.dto)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            if (response.codigoHttp == this.geGenericConst.codErrorValidacion200) {
                                this.msgsPrincipal.push({severity: 'error', summary: "Mensaje de validación", detail: response.mensajeUsuario});
                            } else {
                                this.displayDialog = false;
                                this.accion = 0;
                                this.respuesta.emit({ severity: 'success', summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario, dto: this.dto });
                            }
                        },
                        error => {
                            let errorHttpDto: GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp});
                            this.displayDialog = true;
                        }
                    );
            }
        }
    }
}