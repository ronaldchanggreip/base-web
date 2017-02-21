import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from './auth.service';
import {auditTime} from "rxjs/operator/auditTime";
import {AppConfiguration} from "../common/app.configuration";



@Injectable()
export class AuthCanActive implements CanActivate {
    
    
    constructor(private auth: AuthService, private router: Router, private conf: AppConfiguration) {

    }


    canActivate() {

        if (this.auth.isActive()) {
                this.conf.htmlElementVisibilidad('divFooter',true);
                this.conf.htmlElementVisibilidad('divTolbar',true);
                this.conf.htmlElementVisibilidad('divMenu',true);
                return true;
        }


        this.conf.htmlElementVisibilidad('divFooter',false);
        this.conf.htmlElementVisibilidad('divTolbar',false);
        this.conf.htmlElementVisibilidad('divMenu',false);

        this.router.navigate(['/login']);
        //window.location.href='http://localhost:8080/login';
        return false;


    }


}