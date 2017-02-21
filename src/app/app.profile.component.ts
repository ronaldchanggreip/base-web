import {Component, trigger, state, transition, style, animate, Inject, forwardRef, AfterViewInit} from '@angular/core';
import {AuthService} from "./seguridad/auth.service";
import {SeUsuarioService} from "./seguridad/SeUsuario/service";
import {AppConfiguration} from "./common/app.configuration";
import {SeUsuarioDto} from "./seguridad/SeUsuario/model";
import {AppComponent} from "./app.component";

@Component({
    selector: 'inline-profile',
    providers: [SeUsuarioService],
    template: `
        <div class="profile" [ngClass]="{'profile-expanded':active}" id="divProfile1" style="visibility: hidden">
            <div class="profile-image"></div>
            <a href="#" (click)="onClick($event)">
                <span class="profile-name" id="spProfileName1">Perfil</span>
                <i class="material-icons">keyboard_arrow_down</i>
            </a>
        </div>

        <ul class="ultima-menu profile-menu" [@menu]="active ? 'visible' : 'hidden'" >
            <li role="menuitem">
                <a  (click)="app.showDlgInfoUsuario()" class="ripplelink">
                    <i class="material-icons">person</i>
                    <span id="spProfileName2">Profile</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" class="ripplelink">
                    <i class="material-icons">security</i>
                    <span >Contraseña</span>
                </a>
            </li>
            <li role="menuitem">
                <a  (click)="app.showDlgInfoSistema()"  class="ripplelink">
                    <i class="material-icons">settings_application</i>
                    <span>Sistema</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" class="ripplelink" (click)="app.logout($event)">
                    <i class="material-icons">power_settings_new</i>
                    <span>Salir</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class InlineProfileComponent implements AfterViewInit{

    active: boolean;
    usuarioSession: SeUsuarioDto = new SeUsuarioDto();





    constructor(@Inject(forwardRef(() => AppComponent)) public app:AppComponent,private auth:AuthService, private usuarioService: SeUsuarioService, private conf: AppConfiguration ) {

    }

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
        this.cargamosDatosUsuarioSession();
    }



    ngAfterViewInit(){
        this.cargamosDatosUsuarioSession()
        //console.log("Entra ngAfterViewInit InlineProfileComponent")

    }


    private cargamosDatosUsuarioSession(){
        let userDto:string = sessionStorage.getItem("userDto");
        //console.log(userDto)
        if (userDto) {
            this.usuarioSession = JSON.parse(userDto);
            this.conf.htmlElementSpanSetValue("spProfileName1",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName2",this.usuarioSession.nombre)
            //this.conf.htmlElementSpanSetValue("spProfileName3",this.usuarioSession.nombre)
            //this.conf.htmlElementSpanSetValue("spProfileName4",this.usuarioSession.nombre)
        }else {
            this.conf.htmlElementSpanSetValue("spProfileName1","")
            this.conf.htmlElementSpanSetValue("spProfileName2","")
            //this.conf.htmlElementSpanSetValue("spProfileName3","")
            //this.conf.htmlElementSpanSetValue("spProfileName4","")

        }


    }
}