import {Component, ViewEncapsulation, AfterContentInit} from '@angular/core';

import { Router } from '@angular/router';
import { Message} from 'primeng/primeng';
import {AuthService} from "../auth.service";
import {GeMensajeHttpDto} from "../../generic/error/error.model";
import {AppConfiguration} from "../../common/app.configuration";
import {SeUsuarioService} from "../SeUsuario/service";
import {SeUsuarioDto} from "../SeUsuario/model";


@Component({
    selector: 'login',
    templateUrl: 'login.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements AfterContentInit{
    user: string;
    password: string;
    location: Location;
    public msgsPrincipal: Message[] = [];

    constructor(private auth: AuthService,private conf: AppConfiguration, private router: Router, private usuarioService: SeUsuarioService) {

    }

    ngOnInit() {
        this.auth.logout();
        this.user = null;
        this.password = null;
    }

    ngAfterContentInit() {

    }


    login(event) {
        sessionStorage.clear();
        this.msgsPrincipal = [];
        this.auth.getAccessToken(this.user,this.password).subscribe(res=>
            {
                let tokenJson = JSON.stringify(res);

                sessionStorage.setItem('access_token',res.access_token);
                sessionStorage.setItem('oauth_token',JSON.stringify(res));

                this.cargamosDatosUsuarioSession();
                //console.log('llega al router')
                this.router.navigate(['/home']);
            },(err => 
            {
                let errorDto:GeMensajeHttpDto = err;
                this.msgsPrincipal.push({ severity: 'error', summary: errorDto.resumenHttp, detail: errorDto.mensajeUsuario });
        
            }))
    }

    private cargamosDatosUsuarioSession(){
        let token = sessionStorage.getItem("oauth_token");
        if (token!= null) {
            let login: any = JSON.parse(sessionStorage.getItem("oauth_token"));
            this.usuarioService.getsLoginEmail(login.access_login).subscribe(
                res=>{
                    let rpta: GeMensajeHttpDto = res;
                    sessionStorage.setItem('userDto',JSON.stringify(rpta.respuesta));
                },
                err=> {
                    sessionStorage.setItem('userDto',"");

                }
            )
        }


    }
}

