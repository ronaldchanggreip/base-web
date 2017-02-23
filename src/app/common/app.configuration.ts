import { Injectable, OnInit } from '@angular/core';
import { Headers } from "@angular/http";
import { Base64 } from '../../app/common/base64'

@Injectable()
export class AppConfiguration implements OnInit {

    //M001-RCHANG-20161201-Se crea clase AppConfiguration para mantener siempre variables en los componentes y/o servicios
    serverIp:string = '127.0.0.1';
    serverPort:string = '9082';

    baseUrl: string = "http://"+this.serverIp+":"+this.serverPort+"/base-core/api/"; //9082
    //baseUrl: string = "https://"+this.serverIp+"/exchange-core/api/"; //9082
    //baseUrl: string = "http://92.222.67.53:8080/exchange-core/api/";
    serverIpSeguridad:string = '127.0.0.1';
    serverPortSeguridad:string = '8081';
    baseUrlSecurity: string = "http://"+this.serverIpSeguridad+":"+this.serverPortSeguridad+"/base-security/oauth/"; //8081
    //baseUrlSecurity: string = "https://"+this.serverIpSeguridad+"/exchange-security/oauth/"; //8081
    title: string = "Base Project";

    headers: Headers = new Headers();
    headersSecurity: Headers = new Headers();

    appDialogMax:number = 0.8;
    appDialogMed:number = 0.8;

    appDialogMin:number = 0.8;

    infoSisAppVersion:string = "1.00 Beta";

    idApp: string = 'exchangeWeb';
    claveApp: string = 'monaco';
    appId: string = this.idApp+":"+ this.claveApp;//'exchangeWeb:monaco';

    ngOnInit() {
        //Header para recursos
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', 'Bearer c5a2e24c-0d76-4396-b3e9-b35e42442df0')

        //Header para seguridad
        this.headersSecurity.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        // this.headersSecurity.append("Authorization","Basic "+ new Base64().encode(this.appId));

    }

    public htmlElementSetValue (el:string ,value:any){
            let htmlElement: HTMLElement = <HTMLElement> document.getElementById(el);
            if (htmlElement)
            htmlElement.setAttribute("value",value);
    }

    public htmlElementSpanSetValue (el:string ,value:any){
           let htmlElement: HTMLSpanElement = <HTMLSpanElement> document.getElementById(el);
           if (htmlElement)
            htmlElement.innerText = value;
    }

    public htmlElementVisibilidad (el:string ,flag:boolean){
        let htmlElement: HTMLElement = <HTMLElement> document.getElementById(el);
        if (htmlElement) {
            if (flag) {
                htmlElement.setAttribute("style","visibility:visible")
            }else {
                htmlElement.setAttribute("style","visibility:hidden")
            }
        }

    }


}

