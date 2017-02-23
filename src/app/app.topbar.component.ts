import {Component, Inject, forwardRef, AfterViewInit} from '@angular/core';
import {AppComponent} from './app.component';
import {SeUsuarioService} from "./seguridad/SeUsuario/service";
import {AppConfiguration} from "./common/app.configuration";
import {SeUsuarioDto} from "./seguridad/SeUsuario/model";

@Component({
    selector: 'app-topbar',
    providers: [SeUsuarioService],
    template: `
        <div class="topbar clearfix" id="divTolbar" style="visibility: hidden">
            <div class="topbar-left">            
                <div class="logo"></div>
            </div>
            

            <div class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)" [ngClass]="{'menu-button-rotate': app.rotateMenuButton}">
                    <i></i>
                </a>
                
                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="material-icons">menu</i>
                </a>
                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li #profile class="profile-item" *ngIf="app.profileMode==='top'||app.isHorizontal()"
                        [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">

                        <a href="#" (click)="app.onTopbarItemClick($event,profile)">                            
                            <div class="profile-image"></div>
                            <span class="topbar-item-name" id="spProfileName3">Perfil</span>
                        </a>
                        
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                               <a class="ripplelink" [routerLink]="['/profileForm']" [routerLinkActive]="['active-menulink']">
                                    <i class="material-icons">person</i>
                                    <span id="spProfileName5">Mi Perfil</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a  href="javascript:void()" (click)="app.showDlgInfoSistema()"  class="ripplelink">
                                    <i class="material-icons">settings_application</i>
                                    <span>Sistema</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.logout($event)">
                                    <i class="material-icons">power_settings_new</i>
                                    <span>Salir</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                   
                </ul>
            </div>
        </div>
       
    `
})
export class AppTopBar implements AfterViewInit{
    usuarioSession: SeUsuarioDto = new SeUsuarioDto();

    constructor(@Inject(forwardRef(() => AppComponent)) public app:AppComponent, private usuarioService:SeUsuarioService, private conf:AppConfiguration) {}

    ngAfterViewInit(){
        ///this.cargamosDatosUsuarioSession();
    }

    onClick(event) {
        event.preventDefault();
        this.cargamosDatosUsuarioSession();
    }

    private cargamosDatosUsuarioSession(){
        let userDto:string = sessionStorage.getItem("userDto");
        if (userDto) {
            this.usuarioSession = JSON.parse(userDto);
            //   this.conf.htmlElementSpanSetValue("spProfileName1",this.usuarioSession.nombre)
            //    this.conf.htmlElementSpanSetValue("spProfileName2",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName3",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName4",this.usuarioSession.nombre)
        }else {
            // this.conf.htmlElementSpanSetValue("spProfileName1","")
            // this.conf.htmlElementSpanSetValue("spProfileName2","")
            this.conf.htmlElementSpanSetValue("spProfileName3","")
            this.conf.htmlElementSpanSetValue("spProfileName4","")

        }
    }

}