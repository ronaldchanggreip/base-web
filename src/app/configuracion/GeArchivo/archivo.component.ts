import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core'
import { SafeUrlPipe } from '../../generic/pipes/safe-url.pipe';
import {GeArchivoService} from './service'
import { Router } from '@angular/router';
import {GeBaseComponent} from '../../common/base.component';
import {AppConfiguration} from '../../common/app.configuration'
import {GeGenericConst} from '../../common/generic.const'
import {FileUploadModule} from 'primeng/primeng';
import {AuthService} from "../../seguridad/auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import {Message,ConfirmationService, MenuItem, DialogModule, OverlayPanel} from 'primeng/primeng';
import {GeArchivoDto} from "./model";
import { GeFiltroDto, GeFiltroDetaDto, GeFiltroOrderDto } from '../../common/generic.model.filtro'

@Component({
    selector: 'archivoList',
    providers: [GeArchivoService, GeGenericConst, ConfirmationService],
    templateUrl: 'list.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        '.ui-overlaypanel{top: 0px !important; left:0px !important; width: 100%; height: 100%;}',
        '.ui-overlaypanel-content{height: 100%;}'
    ]
})
export class GeArchivoListComponent extends GeBaseComponent implements  OnInit{
    @Input()
    entidad:number = 0;

    @Input()
    registro:number;

    public listaDto: GeArchivoDto[] = [];
    public uploadedFiles: any[] = [];

    public msgsPrincipal: Message[] = [];
    public urlUpload: string = "";
    public items: MenuItem[];
    public selectedFiles: GeArchivoDto[] = [];
    public dto: GeArchivoDto;
    public urlFile: string = "";

    constructor(router: Router, private service: GeArchivoService,configuration: AppConfiguration, private geGenericConst:GeGenericConst,
                private confirmationService: ConfirmationService, auth:AuthService) {
        super('GeArchivoListComponent',router,configuration,auth);
    }

    public ngOnInit(){
        this.widthDialog = window.innerWidth*this.configuration.appDialogMed;
        if(this.registro!=null)
            this.urlUpload = this.service.url + "fileupload/" + this.entidad + "/" + this.registro;
        this.buscar();
    }

    public onBeforeSend(event){
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }

    public crearFiltro(): GeFiltroDto {
        let filtro: GeFiltroDto = new GeFiltroDto();

        filtro.filtros.push(new GeFiltroDetaDto('registro', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, this.registro + ''));
        filtro.filtros.push(new GeFiltroDetaDto('entidadDto.id', this.geGenericConst.opeEq, this.geGenericConst.tdEntero.codigo, this.entidad + ''));

        filtro.order = true;
        filtro.orders.push(new GeFiltroOrderDto('fecha', this.geGenericConst.ordDes));

        return filtro;
    }

    public eliminar(archivo: GeArchivoDto){
        let archivos: GeArchivoDto[] = [];
        archivos.push(archivo);
        this.eliminarVarios(archivos);
    }

    public modificar(archivo: GeArchivoDto){
        let archivos: GeArchivoDto[] = [];
        archivos.push(archivo);
        this.modificarVarios(archivos);
    }

    public descargar(event, overlayImage: OverlayPanel, overlayPdf: OverlayPanel, archivo: GeArchivoDto){
        var contentType: string = archivo.contentType;
        this.urlFile = "";
        this.service.getImage(archivo.id).subscribe(imageData =>{
            this.urlFile = URL.createObjectURL(new Blob([imageData], {
                type: contentType
            }));
            if(this.geGenericConst.cTypesDialog.indexOf(contentType) != -1){
                overlayImage.toggle(event);
            }

            if(this.geGenericConst.cTypesIframe.indexOf(contentType)  != -1){
                overlayPdf.toggle(event);
            }

            if(this.geGenericConst.cTypesNoPrev.indexOf(contentType)  != -1){
                console.log("entrando.....");
                //window.open(this.urlFile);
            }
        });
    }

    public modificarVarios(archivos: GeArchivoDto[]){
        /*this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea modificar el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {*/
                this.service
                    .modificar(archivos)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.msgsPrincipal.push({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario});
                            this.buscar();
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                        }
                    );
            /*},
            reject: () => {
                //No realiza nada
            }
        });*/
    }

    public eliminarVarios(archivos: GeArchivoDto[]){
       /* this.confirmationService.confirm({ //Mensaje de confirmación de guardar el registro
            message: 'Está seguro que desea eliminar el(los) registro(s)?',
            header: 'Confirmacion',
            accept: () => {*/
                this.service
                    .eliminar(archivos)
                    .subscribe(
                        (response: GeMensajeHttpDto) => {
                            var tipoMensaje = "success";
                            if(response.codigoHttp == this.geGenericConst.codErrorValidacion200)
                                tipoMensaje = "warning";
                            this.msgsPrincipal.push({ severity: tipoMensaje, summary: 'Mensaje de Conformidad', detail: response.mensajeUsuario});
                            this.buscar();
                        },
                        error => {
                            let errorHttpDto:GeMensajeHttpDto = error;
                            this.msgsPrincipal.push({ severity: 'error', summary: errorHttpDto.resumenHttp, detail: errorHttpDto.mensajeSistemaHttp });
                        }
                    );
            /*},
            reject: () => {
                //No realiza nada
            }
        });*/
    }

    onUpload(event) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.msgsPrincipal = [];
        this.msgsPrincipal.push({severity: 'info', summary: 'Los archivos han sido cargados exitósamente', detail: ''});
        this.buscar();
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