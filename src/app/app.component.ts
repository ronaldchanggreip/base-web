import {
    Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnChanges, AfterViewChecked,
    OnInit
} from '@angular/core';
import {AuthService} from "./seguridad/auth.service";
import {Router} from "@angular/router";
import {AppConfiguration} from "./common/app.configuration";
import {SeUsuarioService} from "./seguridad/SeUsuario/service";
import {SeUsuarioDto} from "./seguridad/SeUsuario/model";

enum MenuOrientation {
    STATIC,
    OVERLAY,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [SeUsuarioService]
})
export class AppComponent implements AfterViewInit, AfterViewChecked, OnInit {

    layoutCompact: boolean = true;

    layoutMode: MenuOrientation = MenuOrientation.HORIZONTAL;

    darkMenu: boolean = false;

    profileMode: string = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    modal: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    resetMenu: boolean;

    usuarioSession: SeUsuarioDto = new SeUsuarioDto();

    @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;



    displayDlgInfoSistema: boolean = false;
    infoSisServerIp:string;
    infoSisServerPort:string;
    infoSisBaseUrl: string;

    infoSisServerIpSeguridad:string;
    infoSisServerPortSeguridad:string;
    infoSisBaseUrlSecurity: string;


    infoSisWidth: number;
    infoSisHeigth: number;
    infoSisIdApp: string;
    infoSisAppVersion: string;

    public widthDialog:number;

    displayDlgInfoUsuario: boolean = false;


    constructor(public renderer: Renderer, private el: ElementRef, private router:Router, private auth:AuthService, private conf: AppConfiguration, private usuarioService: SeUsuarioService) {}

    ngOnInit(){
        this.widthDialog = window.innerWidth*this.conf.appDialogMin;
    }

    ngAfterViewInit() {
        this.layoutContainer = <HTMLDivElement> this.layourContainerViewChild.nativeElement;
        this.layoutMenuScroller = <HTMLDivElement> this.layoutMenuScrollerViewChild.nativeElement;

        //hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if(!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if(!this.menuClick) {
                this.resetMenu = true;
            }

            this.topbarItemClick = false;
            this.menuClick = false;
        });

        setTimeout(() => {
            jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
        }, 10);


    }

    ngAfterViewChecked () {
        this.auth.activarMenuFooterTolbar();
    }

    onMenuButtonClick(event) {
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if(this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;

            if(this.overlayMenuActive)
                this.enableModal();
            else
                this.disableModal();
        }
        else {
            if(this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            }
            else {
                if(this.staticMenuMobileActive) {
                    this.staticMenuMobileActive = false;
                    this.disableModal();
                }
                else {
                    this.staticMenuMobileActive = true;
                    this.enableModal();
                }
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if(!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        if(this.overlayMenuActive || this.staticMenuMobileActive) {
            this.rotateMenuButton = false;
            this.overlayMenuActive = false;
            this.staticMenuMobileActive = false;
            this.disableModal();
        }
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if(this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;
        this.cargamosDatosUsuarioSession();
        event.preventDefault();
    }

    enableModal() {
        this.modal = document.createElement("div");
        this.modal.className = 'layout-mask';
        this.layoutContainer.appendChild(this.modal);
    }

    disableModal() {
        if(this.modal) {
            this.layoutContainer.removeChild(this.modal);
        }
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    ngOnDestroy() {
        this.disableModal();

        if(this.documentClickListener) {
            this.documentClickListener();
        }

        jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
    }

    private cargamosDatosUsuarioSession(){
        let userDto:string = sessionStorage.getItem("userDto");
        if (userDto) {
            this.usuarioSession = JSON.parse(userDto);
            this.conf.htmlElementSpanSetValue("spProfileName1",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName2",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName3",this.usuarioSession.nombre)
            this.conf.htmlElementSpanSetValue("spProfileName4",this.usuarioSession.nombre)
        }else {
            this.conf.htmlElementSpanSetValue("spProfileName1","")
            this.conf.htmlElementSpanSetValue("spProfileName2","")
            this.conf.htmlElementSpanSetValue("spProfileName3","")
            this.conf.htmlElementSpanSetValue("spProfileName4","")
        }
    }

    showDlgInfoUsuario() {

        this.cargamosDatosUsuarioSession();
        this.displayDlgInfoUsuario = true;
    }

    showDlgInfoSistema() {
        this.infoSisServerIp = this.conf.serverIp;
        this.infoSisServerPort = this.conf.serverPort;
        this.infoSisBaseUrl = this.conf.baseUrl;

        this.infoSisServerIpSeguridad = this.conf.serverIpSeguridad;
        this.infoSisServerPortSeguridad = this.conf.serverPortSeguridad;
        this.infoSisBaseUrlSecurity = this.conf.baseUrlSecurity;

        this.infoSisWidth = window.innerWidth;
        this.infoSisHeigth = window.innerHeight;
        this.infoSisIdApp = this.conf.idApp;
        this.infoSisAppVersion = this.conf.infoSisAppVersion;

        this.displayDlgInfoSistema = true;

    }

    logout(event){
        this.auth.logout();
    }



}