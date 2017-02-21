
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { AppConfiguration } from '../../app/common/app.configuration'
import { GeGenericConst } from '../../app/common/generic.const'
import { GeBaseService } from '../../app/common/base.service'
import { Base64 } from '../../app/common/base64'
import {GeMensajeHttpDto} from "../generic/error/error.model";
import {SeOauthToken} from "./model";
import {Router} from "@angular/router";



@Injectable()
export class AuthService extends GeBaseService {
    access_token: string;
    oauth_token: any;

    //urlSecurity: string = "http://localhost:8081/exchange-security/oauth/";
    constructor(http: Http, configuration: AppConfiguration, geGenericConst:GeGenericConst, private router: Router) {
        
        super('AuthService', '', http, configuration, geGenericConst);
        this.access_token = sessionStorage.getItem('access_token');
        this.oauth_token = JSON.parse(sessionStorage.getItem('oauth_token'));
    }

    public isActive(): boolean {
        //return true;
       if (sessionStorage.getItem('access_token')) {
           //this.activarMenu();
            return true;
        } else {
            return false;
        }
    }

    public activarMenuFooterTolbar() {
        if (this.isActive()) {
            this.configuration.htmlElementVisibilidad('divFooter',true);
            this.configuration.htmlElementVisibilidad('divTolbar',true);
            this.configuration.htmlElementVisibilidad('divMenu',true);
            this.configuration.htmlElementVisibilidad('divProfile1',true);
            //this.configuration.htmlElementVisibilidad('divProfile2',true);
        }else {
            this.configuration.htmlElementVisibilidad('divFooter',false);
            this.configuration.htmlElementVisibilidad('divTolbar',false);
            this.configuration.htmlElementVisibilidad('divMenu',false);
            this.configuration.htmlElementVisibilidad('divProfile1',false);
            //this.configuration.htmlElementVisibilidad('divProfile2',false);
        }

    }



    public revokeToken(tokenRevoke:string): Observable<boolean> {

        //console.log(JSON.stringify(dto))
        let headersSecurity: Headers = this.headers;
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.post(this.url + "revokeToken/"+ tokenRevoke, { headers: headersSecurity })
            .map(this.revokeTokenOk)
            .catch(this.revokeTokenNok);
    }

    public revokeRefreshToken(tokenRevoke:string): Observable<boolean> {

        //console.log(JSON.stringify(dto))
        let headersSecurity: Headers = this.headers;
        let token: string;
        if (sessionStorage.getItem('access_token_r')) { //Si existe token refresh
            token = sessionStorage.getItem('access_token_r');
        } else {
            token = sessionStorage.getItem('access_token');
        }
        headersSecurity.append('Authorization', 'Bearer ' + token)

        return this.http.post(this.url + "revokeRefreshToken/"+ tokenRevoke, { headers: headersSecurity })
            .map(this.revokeTokenOk)
            .catch(this.revokeTokenNok);

    }

    private revokeTokenOk(res: Response) {
        //console.log("refreshTokenOk");

        try {
            //console.log(res.status);

            if (res.status==200) {
                //return Observable.create(true);
                return res.json();
            }else {
                //this.router.navigate(["/login"])
                //window.location.href='http://localhost:8080/login';
                return Observable.create(false);
            }
        }catch (e) {
            //window.location.href='http://localhost:8080/login';
            //this.router.navigate(["/login"])
            return Observable.throw(false);
        }


    }

    private revokeTokenNok(res: Response | any ) {
        //console.log("refreshTokenNok");
        //window.location.href='http://localhost:8080/login';
        return Observable.throw(false);
        //return Observable.create(false);


    }


    public refreshToken(refreshToken:string): Observable<SeOauthToken> {

        if (refreshToken!=null) {
            let url = this.urlSecurity + "token";
            //console.log(url);

            //console.log(this.optsSecurity);
            let headersSecurity: Headers = new Headers();
            headersSecurity.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            let appId: string = 'exchangeWeb:monaco'; //ID:Password de la aplciacion cliente exchangeWeb
            headersSecurity.append("Authorization","Basic "+ new Base64().encode(appId));
            //onsole.log(headersSecurity);

            let urlSearchParams = new URLSearchParams();
            urlSearchParams.append('refresh_token', refreshToken);
            urlSearchParams.append('grant_type', 'refresh_token');//Grant type de la aplicacion cliente
            let body = urlSearchParams.toString();
            //console.log(body);

            return this.http.post(url, body, { headers: headersSecurity })
                .map(this.refreshTokenOk)
                .catch(this.refreshTokenNok);
        }else {
            return Observable.throw(false);
        }

    }

    private refreshTokenOk(res: Response) {
        //console.log("refreshTokenOk");

        try {
            //console.log(res.status);

            if (res.status==200) {
                //return Observable.create(true);
                return res.json();
            }else {
                //this.router.navigate(["/login"])
                //window.location.href='http://localhost:8080/login';
                return Observable.create(false);
            }
        }catch (e) {
            //window.location.href='http://localhost:8080/login';
            //this.router.navigate(["/login"])
            return Observable.throw(false);
        }


    }

    private refreshTokenNok(res: Response | any ) {
        //console.log("refreshTokenNok");
        //window.location.href='http://localhost:8080/login';
        return Observable.throw(false);
        //return Observable.create(false);


    }


    public getAccessToken(username: string, password: string): Observable<SeOauthToken> {

        let url = this.urlSecurity + "token";
        //console.log(url);

        //console.log(this.optsSecurity);
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        let appId: string = 'exchangeWeb:monaco'; //ID:Password de la aplciacion cliente exchangeWeb
        headersSecurity.append("Authorization","Basic "+ new Base64().encode(appId));
        //onsole.log(headersSecurity);

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', username);
        urlSearchParams.append('password', password);
        urlSearchParams.append('grant_type', 'password');//Grant type de la aplicacion cliente
        let body = urlSearchParams.toString();
        //console.log(body);

        return this.http.post(url, body, { headers: headersSecurity })
            .map(this.cargarData2)
            .catch(this.cargarError2);

    }

    //http://92.222.67.53:8080/exchange-security/oauth/check_token?token=37778356-c90b-4b2b-b51f-7b62e32e2a66
    public checkToken (token:string):Observable<any> {
        let url = this.urlSecurity + "check_token";
        //console.log(this.optsSecurity);
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        let appId: string = 'exchangeWeb:monaco'; //ID:Password de la aplciacion cliente exchangeWeb
        headersSecurity.append("Authorization","Basic "+ new Base64().encode(appId));
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('token', token);
        let body = urlSearchParams.toString();

        return this.http.post(url, body, { headers: headersSecurity })

            .map(this.checkTokenOk)
            .catch(this.checkTokenNok);

    }

    private checkTokenOk(res: Response) {
        //console.log("checkTokenOk");
        try {
            //console.log(res.status);

            if (res.status==200) {
                //return Observable.create(true);
                return Observable.create(true);
            }else {
                //this.router.navigate(["/login"])
                //window.location.href='http://localhost:8080/login';
                return Observable.create(false);
            }
        }catch (e) {
            //window.location.href='http://localhost:8080/login';
            //this.router.navigate(["/login"])
            return Observable.throw(false);
        }


    }

    private checkTokenNok(res: Response | any ) {
        //console.log("checkTokenNok");
        //window.location.href='http://localhost:8080/login';
        return Observable.throw(false);
        //return Observable.create(false);


    }

    public cargarData2(error: Response): Observable<any> {
        //console.log('cargarData')
        //console.log(res)

        //console.log(error.status)

        if (error.status == 100) {
            return Observable.throw(new GeMensajeHttpDto(100, '1XX', 'Informativos', 'Continuar', 'El navegador puede continuar realizando su petición (se utiliza para indicar que la primera parte de la petición del navegador se ha recibido correctamente).', 'Continuar'));
        } else if (error.status == 101) {
            return Observable.throw(new GeMensajeHttpDto(101, '1XX', 'Informativos', 'Cambiando de protocolos', 'El servidor acepta el cambio de protocolo propuesto por el navegador (puede ser por ejemplo un cambio de HTTP 1.0 a HTTP 1.1).', 'Cambiando de protocolos'));
        } else if (error.status == 200) {
            return error.json();
        } else if (error.status == 201) {
            //return Observable.throw(new GeMensajeHttpDto(201, '2XX', 'Finalización correcta', 'Creado', 'La petición del navegador se ha completado con éxito y como resultado, se ha creado un nuevo recurso (la respuesta incluye la URI de ese recurso).', 'Creado'));
            return null;
        } else if (error.status == 202) {
            //return Observable.throw(new GeMensajeHttpDto(202, '2XX', 'Finalización correcta', 'Aceptado', 'La petición del navegador se ha aceptado y se está procesando en estos momentos, por lo que todavía no hay una respuesta (se utiliza por ejemplo cuando un proceso realiza una petición muy compleja a un servidor y no quiere estar horas esperando la respuesta).', 'Aceptado'));
            return null;
        } else if (error.status == 203) {
            //return Observable.throw(new GeMensajeHttpDto(203, '2XX', 'Finalización correcta', 'Información no autoritativa', 'La petición se ha completado con éxito, pero su contenido no se ha obtenido de la fuente originalmente solicitada sino de otro servidor.', 'Información no autoritativa'));
            return null;
        } else if (error.status == 204) {
            //return Observable.throw(new GeMensajeHttpDto(204, '2XX', 'Finalización correcta', 'Sin contenido', 'La petición se ha completado con éxito pero su respuesta no tiene ningún contenido (la respuesta sí que puede incluir información en sus cabeceras HTTP).', 'Sin contenido'));
            return null;
        } else if (error.status == 205) {
            //return Observable.throw(new GeMensajeHttpDto(205, '2XX', 'Finalización correcta', 'Restablecer contenido', 'La petición se ha completado con éxito, pero su respuesta no tiene contenidos y además, el navegador tiene que inicializar la página desde la que se realizó la petición (este código es útil por ejemplo para páginas con formularios cuyo contenido debe borrarse después de que el usuario lo envíe).', 'Restablecer contenido'));
            return null;
        } else if (error.status == 206) {
            //return Observable.throw(new GeMensajeHttpDto(206, '2XX', 'Finalización correcta', 'Contenido parcial', 'La respuesta de esta petición sólo tiene parte de los contenidos, tal y como lo solicitó el propio navegador (se utiliza por ejemplo cuando se descarga un archivo muy grande en varias partes para acelerar la descarga).', 'Contenido parcial'));
            return null;
        } else if (error.status == 207) {
            //return Observable.throw(new GeMensajeHttpDto(207, '2XX', 'Finalización correcta', 'Multi-Status (WebDAV)', 'La respuesta consiste en un archivo XML que contiene en su interior varias respuestas diferentes (el número depende de las peticiones realizadas previamente por el navegador).', 'Multi-Status (WebDAV)'));
            return null;
        } else if (error.status == 208) {
            //return Observable.throw(new GeMensajeHttpDto(208, '2XX', 'Finalización correcta', 'Already Reported (WebDAV)', 'El listado de elementos DAV ya se notificó previamente, por lo que no se van a volver a listar.', 'Already Reported (WebDAV)'));
            return null;
        } else if (error.status == 300) {
            return Observable.throw(new GeMensajeHttpDto(300, '3XX', 'Redireccionamiento', 'Opciones múltiples', 'Existe más de una variante para el recurso solicitado por el navegador (por ejemplo si la petición se corresponde con más de un archivo).', 'Opciones múltiples'));
        } else if (error.status == 301) {
            return Observable.throw(new GeMensajeHttpDto(301, '3XX', 'Redireccionamiento', 'Movido definitivamente', 'El recurso solicitado por el navegador se encuentra en otro lugar y este cambio es permanente. El navegador es redirigido automáticamente a la nueva localización de ese recurso (este código es muy importante para tareas relacionadas con el SEO de los sitios web).', 'Movido definitivamente'));
        } else if (error.status == 302) {
            return Observable.throw(new GeMensajeHttpDto(302, '3XX', 'Redireccionamiento', 'Encontrados', 'El recurso solicitado por el navegador se encuentra en otro lugar, aunque sólo por tiempo limitado. El navegador es redirigido automáticamente a la nueva localización de ese recurso.', 'Encontrados'));
        } else if (error.status == 303) {
            return Observable.throw(new GeMensajeHttpDto(303, '3XX', 'Redireccionamiento', 'Ver otro', 'El recurso solicitado por el navegador se encuentra en otro lugar. El servidor no redirige automáticamente al navegador, pero le indica la nueva URI en la que se puede obtener el recurso.', 'Ver otro'));
        } else if (error.status == 304) {
            return Observable.throw(new GeMensajeHttpDto(304, '3XX', 'Redireccionamiento', 'No modificado', 'Cuando el navegador pregunta si un recurso ha cambiado desde la última vez que se solicitó, el servidor responde con este código cuando el recurso no ha cambiado.', 'No modificado'));
        } else if (error.status == 305) {
            return Observable.throw(new GeMensajeHttpDto(305, '3XX', 'Redireccionamiento', 'Usar proxy', 'El recurso solicitado por el navegador debe obtenerse a través del proxy cuya dirección se indica en la cabecera Location de esta misma respuesta.', 'Usar proxy'));
        } else if (error.status == 306) {
            return Observable.throw(new GeMensajeHttpDto(306, '3XX', 'Redireccionamiento', 'cambiar proxy', 'Este código se utilizaba en las versiones antiguas de HTTP pero ya no se usa (aunque está reservado para usos futuros).', 'cambiar proxy'));
        } else if (error.status == 307) {
            return Observable.throw(new GeMensajeHttpDto(307, '3XX', 'Redireccionamiento', 'Redireccionar temporalmente', 'El recurso solicitado por el navegador se puede obtener en otro lugar, pero sólo para esta petición. Las próximas peticiones pueden seguir utilizando la localización original del recurso.', 'Redireccionar temporalmente'));
        } else if (error.status == 308) {
            return Observable.throw(new GeMensajeHttpDto(308, '3XX', 'Redireccionamiento', 'Redireccionar permanente', 'El recurso solicitado por el navegador se encuentra en otro lugar y este cambio es permanente. A diferencia del código 301, no se permite cambiar el método HTTP para la nueva petición (así por ejemplo, si envías un formulario a un recurso que ha cambiado de lugar, todo seguirá funcionando bien).', 'Redireccionar permanente'));
        } else if (error.status == 400) {
            return Observable.throw(new GeMensajeHttpDto(400, '4XX', 'Errores de cliente', 'Solicitud incorrecta', 'El servidor no es capaz de entender la petición del navegador porque su sintaxis no es correcta.', 'La petición fue incorrecta; comuniquese con el Área de Sistemas.'));
        } else if (error.status == 401) {
            return Observable.throw(new GeMensajeHttpDto(401, '4XX', 'Errores de cliente', 'No autorizado', 'El recurso solicitado por el navegador requiere de autenticación. La respuesta incluye una cabecera de tipo WWW-Authenticate para que el navegador pueda iniciar el proceso de autenticación.', 'El sistema necesita que se autentique para realizar esta operación.'));
        } else if (error.status == 402) {
            return Observable.throw(new GeMensajeHttpDto(402, '4XX', 'Errores de cliente', 'Se requiere pago', 'Este código está reservado para usos futuros.', 'El sistema requiere un pago para utilizar esta opcion.'));
        } else if (error.status == 403) {
            return Observable.throw(new GeMensajeHttpDto(403, '4XX', 'Errores de cliente', 'Prohibido', 'La petición del navegador es correcta, pero el servidor no puede responder con el recurso solicitado porque se ha denegado el acceso.', 'Esta autenticado pero su usuario no tiene acceso a esta opcion.'));
        } else if (error.status == 404) {
            return Observable.throw(new GeMensajeHttpDto(404, '4XX', 'Errores de cliente', 'No encontrado', 'El servidor no puede encontrar el recurso solicitado por el navegador y no es posible determinar si esta ausencia es temporal o permanente.', 'La opción no está disponible; comuniquese con el Área de Sistemas'));
        } else if (error.status == 405) {
            return Observable.throw(new GeMensajeHttpDto(405, '4XX', 'Errores de cliente', 'Método no permitido', 'El navegador ha utilizado un método (GET, POST, etc.) no permitido por el servidor para obtener ese recurso.', 'El metodo no está permitido; comuniquese con el Área de Sistemas'));
        } else if (error.status == 406) {
            return Observable.throw(new GeMensajeHttpDto(406, '4XX', 'Errores de cliente', 'No aceptable', 'El recurso solicitado tiene un formato que en teoría no es aceptable por el navegador, según los valores que ha indicado en la cabecera Accept de la petición.', 'La petición no se acepta; comuniquese con el Área de Sistemas.'));
        } else if (error.status == 407) {
            return Observable.throw(new GeMensajeHttpDto(407, '4XX', 'Errores de cliente', 'Se necesita autorización del Proxy', 'Es muy similar al código 401, pero en este caso, el navegador debe autenticarse primero con un proxy.', 'Se necesita autorización de un proxy; comuniquese con el Área de Sistemas'));
        } else if (error.status == 408) {
            return Observable.throw(new GeMensajeHttpDto(408, '4XX', 'Errores de cliente', 'Tiempo de espera de la petición', 'El navegador ha tardado demasiado tiempo en realizar su petición y el servidor ya no espera esa petición. No obstante, el navegador puede realizar nuevas peticiones cuando quiera.', 'El recurso está ocupado intente nuevamente en unos minutos'));
        } else if (error.status == 409) {
            return Observable.throw(new GeMensajeHttpDto(409, '4XX', 'Errores de cliente', 'Conflicto', 'A petición del navegador no se ha podido completar porque se ha producido un conflicto con el recurso solicitado. El caso más habitual es el de las peticiones de tipo PUT que intentan modificar un recurso que a su vez ya ha sido modificado por otro lado.', 'El recurso está ocupado intente nuevamente en unos minutos'));
        } else if (error.status == 410) {
            return Observable.throw(new GeMensajeHttpDto(410, '4XX', 'Errores de cliente', 'Desaparecido', 'No es posible encontrar el recurso solicitado por el navegador y esta ausencia se considera permanente. Si existe alguna posibilidad de que el recurso vuelva a estar disponible, se debe utilizar el código 404.', 'La opción no está disponible; comuniquese con el Área de Sistemas'));
        } else if (error.status == 411) {
            return Observable.throw(new GeMensajeHttpDto(411, '4XX', 'Errores de cliente', 'Longitud requerida', 'El servidor rechaza la petición del navegador porque no incluye la cabecera Content-Length adecuada.', 'No se ha incluido la cabecera; comuniquese con el Área de Sistemas'));
        } else if (error.status == 412) {
            return Observable.throw(new GeMensajeHttpDto(412, '4XX', 'Errores de cliente', 'Error en la condición previa', 'El servidor no es capaz de cumplir con algunas de las condiciones impuestas por el navegador en su petición.', 'El servidor requiere cumplir condiciones del navegador; comuniquese con el Área de Sistemas'));
        } else if (error.status == 413) {
            return Observable.throw(new GeMensajeHttpDto(413, '4XX', 'Errores de cliente', 'Entidad de solicitud demasiado grande', 'La petición del navegador es demasiado grande y por ese motivo el servidor no la procesa.', 'La solicitud es demasida grande; comuniquese con el Área de Sistemas'));
        } else if (error.status == 414) {
            return Observable.throw(new GeMensajeHttpDto(414, '4XX', 'Errores de cliente', 'Identificador URI de la solicitud demasiado largo', 'La URI de la petición del navegador es demasiado grande y por ese motivo el servidor no la procesa (esta condición se produce en muy raras ocasiones y casi siempre porque el navegador envía como GET una petición que debería ser POST).', 'La URL es demasiada larga; comuniquese con el Área de Sistemas'));
        } else if (error.status == 415) {
            return Observable.throw(new GeMensajeHttpDto(415, '4XX', 'Errores de cliente', 'Tipo de medio no compatible', 'La petición del navegador tiene un formato que no entiende el servidor y por eso no se procesa.', 'La petición no es compatible; comuniquese con el Área de Sistemas'));
        } else if (error.status == 416) {
            return Observable.throw(new GeMensajeHttpDto(416, '4XX', 'Errores de cliente', 'El intervalo pedido no es adecuado', 'El navegador ha solicitado una porción inexistente de un recurso. Este error se produce cuando el navegador descarga por partes un archivo muy grande y calcula mal el tamaño de algún trozo.', 'Error al obtener un archivo grande; comuniquese con el Área de Sistemas'));
        } else if (error.status == 417) {
            return Observable.throw(new GeMensajeHttpDto(417, '4XX', 'Errores de cliente', 'Error en las expectativas', 'La petición del navegador no se procesa porque el servidor no es capaz de cumplir con los requerimientos de la cabecera Expect de la petición.', 'Error en las espectativas; comuniquese con el Área de Sistemas'));
        } else if (error.status == 500) {
            return Observable.throw(new GeMensajeHttpDto(500, '5XX', 'Errores de servidor', 'Error interno del servidor', 'La solicitud del navegador no se ha podido completar porque se ha producido un error inesperado en el servidor.', 'Error interno del servidor; comuniquese con el Área de Sistemas'));
        } else if (error.status == 501) {
            return Observable.throw(new GeMensajeHttpDto(501, '5XX', 'Errores de servidor', 'No implementado', 'El servidor no soporta alguna funcionalidad necesaria para responder a la solicitud del navegador (como por ejemplo el método utilizado para la petición).', 'Error en el servidor por funcionalidad no soportada; comuniquese con el Área de Sistemas'));
        } else if (error.status == 502) {
            return Observable.throw(new GeMensajeHttpDto(502, '5XX', 'Errores de servidor', 'Puerta de enlace no válida', 'El servidor está actuando de proxy o gateway y ha recibido una respuesta inválida del otro servidor, por lo que no puede responder adecuadamente a la petición del navegador.', 'La puerta de enlace no es válida; comuniquese con el Área de Sistemas'));
        } else if (error.status == 503) {
            return Observable.throw(new GeMensajeHttpDto(503, '5XX', 'Errores de servidor', 'Servicio no disponible', 'El servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento.', 'Servicio no disponible; comuniquese con el Área de Sistemas'));
        } else if (error.status == 504) {
            return Observable.throw(new GeMensajeHttpDto(504, '5XX', 'Errores de servidor', 'Tiempo de espera agotado para la puerta de enlace', 'El servidor está actuando de proxy o gateway y no ha recibido a tiempo una respuesta del otro servidor, por lo que no puede responder adecuadamente a la petición del navegador.', 'Tiempo agotado; comuniquese con el Área de Sistemas'));
        } else if (error.status == 505) {
            return Observable.throw(new GeMensajeHttpDto(505, '5XX', 'Errores de servidor', 'Versión de HTTP no compatible', 'El servidor no soporta o no quiere soportar la versión del protocolo HTTP utilizada en la petición del navegador.', 'La versión de HTTP no es compatible; comuniquese con el Área de Sistemas'));
        }
    }

    public cargarError2(error: Response | any): Observable<any> {
        //console.log('cargarError')
        //console.log(error)
        // In a real world app, we might use a remote logging infrastructure

        if (error instanceof Response) {
            //console.log('entra response error');
            //console.log(error.status);

            if (error.status == 100) {
                return Observable.throw(new GeMensajeHttpDto(100, '1XX', 'Informativos', 'Continuar', 'El navegador puede continuar realizando su petición (se utiliza para indicar que la primera parte de la petición del navegador se ha recibido correctamente).', 'Continuar'));
            } else if (error.status == 101) {
                return Observable.throw(new GeMensajeHttpDto(101, '1XX', 'Informativos', 'Cambiando de protocolos', 'El servidor acepta el cambio de protocolo propuesto por el navegador (puede ser por ejemplo un cambio de HTTP 1.0 a HTTP 1.1).', 'Cambiando de protocolos'));
            } else if (error.status == 200) {
                return Observable.throw(new GeMensajeHttpDto(200, '2XX', 'Finalización correcta', 'Correcto', 'La petición del navegador se ha completado con éxito', 'Correcto'));
            } else if (error.status == 201) {
                //return Observable.throw(new GeMensajeHttpDto(201, '2XX', 'Finalización correcta', 'Creado', 'La petición del navegador se ha completado con éxito y como resultado, se ha creado un nuevo recurso (la respuesta incluye la URI de ese recurso).', 'Creado'));
                return Observable.create();//Enviamos vacio
            } else if (error.status == 202) {
                return Observable.throw(new GeMensajeHttpDto(202, '2XX', 'Finalización correcta', 'Aceptado', 'La petición del navegador se ha aceptado y se está procesando en estos momentos, por lo que todavía no hay una respuesta (se utiliza por ejemplo cuando un proceso realiza una petición muy compleja a un servidor y no quiere estar horas esperando la respuesta).', 'Aceptado'));
            } else if (error.status == 203) {
                return Observable.throw(new GeMensajeHttpDto(203, '2XX', 'Finalización correcta', 'Información no autoritativa', 'La petición se ha completado con éxito, pero su contenido no se ha obtenido de la fuente originalmente solicitada sino de otro servidor.', 'Información no autoritativa'));
            } else if (error.status == 204) {
                return Observable.throw(new GeMensajeHttpDto(204, '2XX', 'Finalización correcta', 'Sin contenido', 'La petición se ha completado con éxito pero su respuesta no tiene ningún contenido (la respuesta sí que puede incluir información en sus cabeceras HTTP).', 'Sin contenido'));
            } else if (error.status == 205) {
                return Observable.throw(new GeMensajeHttpDto(205, '2XX', 'Finalización correcta', 'Restablecer contenido', 'La petición se ha completado con éxito, pero su respuesta no tiene contenidos y además, el navegador tiene que inicializar la página desde la que se realizó la petición (este código es útil por ejemplo para páginas con formularios cuyo contenido debe borrarse después de que el usuario lo envíe).', 'Restablecer contenido'));
            } else if (error.status == 206) {
                return Observable.throw(new GeMensajeHttpDto(206, '2XX', 'Finalización correcta', 'Contenido parcial', 'La respuesta de esta petición sólo tiene parte de los contenidos, tal y como lo solicitó el propio navegador (se utiliza por ejemplo cuando se descarga un archivo muy grande en varias partes para acelerar la descarga).', 'Contenido parcial'));
            } else if (error.status == 207) {
                return Observable.throw(new GeMensajeHttpDto(207, '2XX', 'Finalización correcta', 'Multi-Status (WebDAV)', 'La respuesta consiste en un archivo XML que contiene en su interior varias respuestas diferentes (el número depende de las peticiones realizadas previamente por el navegador).', 'Multi-Status (WebDAV)'));
            } else if (error.status == 208) {
                return Observable.throw(new GeMensajeHttpDto(208, '2XX', 'Finalización correcta', 'Already Reported (WebDAV)', 'El listado de elementos DAV ya se notificó previamente, por lo que no se van a volver a listar.', 'Already Reported (WebDAV)'));
            } else if (error.status == 300) {
                return Observable.throw(new GeMensajeHttpDto(300, '3XX', 'Redireccionamiento', 'Opciones múltiples', 'Existe más de una variante para el recurso solicitado por el navegador (por ejemplo si la petición se corresponde con más de un archivo).', 'Opciones múltiples'));
            } else if (error.status == 301) {
                return Observable.throw(new GeMensajeHttpDto(301, '3XX', 'Redireccionamiento', 'Movido definitivamente', 'El recurso solicitado por el navegador se encuentra en otro lugar y este cambio es permanente. El navegador es redirigido automáticamente a la nueva localización de ese recurso (este código es muy importante para tareas relacionadas con el SEO de los sitios web).', 'Movido definitivamente'));
            } else if (error.status == 302) {
                return Observable.throw(new GeMensajeHttpDto(302, '3XX', 'Redireccionamiento', 'Encontrados', 'El recurso solicitado por el navegador se encuentra en otro lugar, aunque sólo por tiempo limitado. El navegador es redirigido automáticamente a la nueva localización de ese recurso.', 'Encontrados'));
            } else if (error.status == 303) {
                return Observable.throw(new GeMensajeHttpDto(303, '3XX', 'Redireccionamiento', 'Ver otro', 'El recurso solicitado por el navegador se encuentra en otro lugar. El servidor no redirige automáticamente al navegador, pero le indica la nueva URI en la que se puede obtener el recurso.', 'Ver otro'));
            } else if (error.status == 304) {
                return Observable.throw(new GeMensajeHttpDto(304, '3XX', 'Redireccionamiento', 'No modificado', 'Cuando el navegador pregunta si un recurso ha cambiado desde la última vez que se solicitó, el servidor responde con este código cuando el recurso no ha cambiado.', 'No modificado'));
            } else if (error.status == 305) {
                return Observable.throw(new GeMensajeHttpDto(305, '3XX', 'Redireccionamiento', 'Usar proxy', 'El recurso solicitado por el navegador debe obtenerse a través del proxy cuya dirección se indica en la cabecera Location de esta misma respuesta.', 'Usar proxy'));
            } else if (error.status == 306) {
                return Observable.throw(new GeMensajeHttpDto(306, '3XX', 'Redireccionamiento', 'cambiar proxy', 'Este código se utilizaba en las versiones antiguas de HTTP pero ya no se usa (aunque está reservado para usos futuros).', 'cambiar proxy'));
            } else if (error.status == 307) {
                return Observable.throw(new GeMensajeHttpDto(307, '3XX', 'Redireccionamiento', 'Redireccionar temporalmente', 'El recurso solicitado por el navegador se puede obtener en otro lugar, pero sólo para esta petición. Las próximas peticiones pueden seguir utilizando la localización original del recurso.', 'Redireccionar temporalmente'));
            } else if (error.status == 308) {
                return Observable.throw(new GeMensajeHttpDto(308, '3XX', 'Redireccionamiento', 'Redireccionar permanente', 'El recurso solicitado por el navegador se encuentra en otro lugar y este cambio es permanente. A diferencia del código 301, no se permite cambiar el método HTTP para la nueva petición (así por ejemplo, si envías un formulario a un recurso que ha cambiado de lugar, todo seguirá funcionando bien).', 'Redireccionar permanente'));
            } else if (error.status == 400) {
                return Observable.throw(new GeMensajeHttpDto(400, '4XX', 'Errores de cliente', 'Solicitud incorrecta', 'El servidor no es capaz de entender la petición del navegador porque su sintaxis no es correcta.', 'La petición fue incorrecta; comuniquese con el Área de Sistemas.'));
            } else if (error.status == 401) {
                return Observable.throw(new GeMensajeHttpDto(401, '4XX', 'Errores de cliente', 'No autorizado', 'El recurso solicitado por el navegador requiere de autenticación. La respuesta incluye una cabecera de tipo WWW-Authenticate para que el navegador pueda iniciar el proceso de autenticación.', 'El sistema necesita que se autentique para realizar esta operación.'));
            } else if (error.status == 402) {
                return Observable.throw(new GeMensajeHttpDto(402, '4XX', 'Errores de cliente', 'Se requiere pago', 'Este código está reservado para usos futuros.', 'El sistema requiere un pago para utilizar esta opcion.'));
            } else if (error.status == 403) {
                return Observable.throw(new GeMensajeHttpDto(403, '4XX', 'Errores de cliente', 'Prohibido', 'La petición del navegador es correcta, pero el servidor no puede responder con el recurso solicitado porque se ha denegado el acceso.', 'Esta autenticado pero su usuario no tiene acceso a esta opcion.'));
            } else if (error.status == 404) {
                return Observable.throw(new GeMensajeHttpDto(404, '4XX', 'Errores de cliente', 'No encontrado', 'El servidor no puede encontrar el recurso solicitado por el navegador y no es posible determinar si esta ausencia es temporal o permanente.', 'La opción no está disponible; comuniquese con el Área de Sistemas'));
            } else if (error.status == 405) {
                return Observable.throw(new GeMensajeHttpDto(405, '4XX', 'Errores de cliente', 'Método no permitido', 'El navegador ha utilizado un método (GET, POST, etc.) no permitido por el servidor para obtener ese recurso.', 'El metodo no está permitido; comuniquese con el Área de Sistemas'));
            } else if (error.status == 406) {
                return Observable.throw(new GeMensajeHttpDto(406, '4XX', 'Errores de cliente', 'No aceptable', 'El recurso solicitado tiene un formato que en teoría no es aceptable por el navegador, según los valores que ha indicado en la cabecera Accept de la petición.', 'La petición no se acepta; comuniquese con el Área de Sistemas.'));
            } else if (error.status == 407) {
                return Observable.throw(new GeMensajeHttpDto(407, '4XX', 'Errores de cliente', 'Se necesita autorización del Proxy', 'Es muy similar al código 401, pero en este caso, el navegador debe autenticarse primero con un proxy.', 'Se necesita autorización de un proxy; comuniquese con el Área de Sistemas'));
            } else if (error.status == 408) {
                return Observable.throw(new GeMensajeHttpDto(408, '4XX', 'Errores de cliente', 'Tiempo de espera de la petición', 'El navegador ha tardado demasiado tiempo en realizar su petición y el servidor ya no espera esa petición. No obstante, el navegador puede realizar nuevas peticiones cuando quiera.', 'El recurso está ocupado intente nuevamente en unos minutos'));
            } else if (error.status == 409) {
                return Observable.throw(new GeMensajeHttpDto(409, '4XX', 'Errores de cliente', 'Conflicto', 'A petición del navegador no se ha podido completar porque se ha producido un conflicto con el recurso solicitado. El caso más habitual es el de las peticiones de tipo PUT que intentan modificar un recurso que a su vez ya ha sido modificado por otro lado.', 'El recurso está ocupado intente nuevamente en unos minutos'));
            } else if (error.status == 410) {
                return Observable.throw(new GeMensajeHttpDto(410, '4XX', 'Errores de cliente', 'Desaparecido', 'No es posible encontrar el recurso solicitado por el navegador y esta ausencia se considera permanente. Si existe alguna posibilidad de que el recurso vuelva a estar disponible, se debe utilizar el código 404.', 'La opción no está disponible; comuniquese con el Área de Sistemas'));
            } else if (error.status == 411) {
                return Observable.throw(new GeMensajeHttpDto(411, '4XX', 'Errores de cliente', 'Longitud requerida', 'El servidor rechaza la petición del navegador porque no incluye la cabecera Content-Length adecuada.', 'No se ha incluido la cabecera; comuniquese con el Área de Sistemas'));
            } else if (error.status == 412) {
                return Observable.throw(new GeMensajeHttpDto(412, '4XX', 'Errores de cliente', 'Error en la condición previa', 'El servidor no es capaz de cumplir con algunas de las condiciones impuestas por el navegador en su petición.', 'El servidor requiere cumplir condiciones del navegador; comuniquese con el Área de Sistemas'));
            } else if (error.status == 413) {
                return Observable.throw(new GeMensajeHttpDto(413, '4XX', 'Errores de cliente', 'Entidad de solicitud demasiado grande', 'La petición del navegador es demasiado grande y por ese motivo el servidor no la procesa.', 'La solicitud es demasida grande; comuniquese con el Área de Sistemas'));
            } else if (error.status == 414) {
                return Observable.throw(new GeMensajeHttpDto(414, '4XX', 'Errores de cliente', 'Identificador URI de la solicitud demasiado largo', 'La URI de la petición del navegador es demasiado grande y por ese motivo el servidor no la procesa (esta condición se produce en muy raras ocasiones y casi siempre porque el navegador envía como GET una petición que debería ser POST).', 'La URL es demasiada larga; comuniquese con el Área de Sistemas'));
            } else if (error.status == 415) {
                return Observable.throw(new GeMensajeHttpDto(415, '4XX', 'Errores de cliente', 'Tipo de medio no compatible', 'La petición del navegador tiene un formato que no entiende el servidor y por eso no se procesa.', 'La petición no es compatible; comuniquese con el Área de Sistemas'));
            } else if (error.status == 416) {
                return Observable.throw(new GeMensajeHttpDto(416, '4XX', 'Errores de cliente', 'El intervalo pedido no es adecuado', 'El navegador ha solicitado una porción inexistente de un recurso. Este error se produce cuando el navegador descarga por partes un archivo muy grande y calcula mal el tamaño de algún trozo.', 'Error al obtener un archivo grande; comuniquese con el Área de Sistemas'));
            } else if (error.status == 417) {
                return Observable.throw(new GeMensajeHttpDto(417, '4XX', 'Errores de cliente', 'Error en las expectativas', 'La petición del navegador no se procesa porque el servidor no es capaz de cumplir con los requerimientos de la cabecera Expect de la petición.', 'Error en las espectativas; comuniquese con el Área de Sistemas'));
            } else if (error.status == 500) {
                return Observable.throw(new GeMensajeHttpDto(500, '5XX', 'Errores de servidor', 'Error interno del servidor', 'La solicitud del navegador no se ha podido completar porque se ha producido un error inesperado en el servidor.', 'Error interno del servidor; comuniquese con el Área de Sistemas'));
            } else if (error.status == 501) {
                return Observable.throw(new GeMensajeHttpDto(501, '5XX', 'Errores de servidor', 'No implementado', 'El servidor no soporta alguna funcionalidad necesaria para responder a la solicitud del navegador (como por ejemplo el método utilizado para la petición).', 'Error en el servidor por funcionalidad no soportada; comuniquese con el Área de Sistemas'));
            } else if (error.status == 502) {
                return Observable.throw(new GeMensajeHttpDto(502, '5XX', 'Errores de servidor', 'Puerta de enlace no válida', 'El servidor está actuando de proxy o gateway y ha recibido una respuesta inválida del otro servidor, por lo que no puede responder adecuadamente a la petición del navegador.', 'La puerta de enlace no es válida; comuniquese con el Área de Sistemas'));
            } else if (error.status == 503) {
                return Observable.throw(new GeMensajeHttpDto(503, '5XX', 'Errores de servidor', 'Servicio no disponible', 'El servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento.', 'Servicio no disponible; comuniquese con el Área de Sistemas'));
            } else if (error.status == 504) {
                return Observable.throw(new GeMensajeHttpDto(504, '5XX', 'Errores de servidor', 'Tiempo de espera agotado para la puerta de enlace', 'El servidor está actuando de proxy o gateway y no ha recibido a tiempo una respuesta del otro servidor, por lo que no puede responder adecuadamente a la petición del navegador.', 'Tiempo agotado; comuniquese con el Área de Sistemas'));
            } else if (error.status == 505) {
                return Observable.throw(new GeMensajeHttpDto(505, '5XX', 'Errores de servidor', 'Versión de HTTP no compatible', 'El servidor no soporta o no quiere soportar la versión del protocolo HTTP utilizada en la petición del navegador.', 'La versión de HTTP no es compatible; comuniquese con el Área de Sistemas'));
            } else if (error.status == 0){
                return Observable.throw(new GeMensajeHttpDto(error.status, '10XX', 'Errores de Sistemas', 'Error de Conexión', 'El servidor de seguridad no está habilitado', 'El servidor de seguridad no está habilitado'));
            }else {

                return Observable.throw(new GeMensajeHttpDto(1000, '10XX', 'Errores de Sistemas', 'Error General de Sistemas', error.statusText, error.statusText));
            }
        } else {
            let errMsg: string;
            errMsg = error.message ? error.message : error.toString();
            return Observable.throw(errMsg);
        }
    }


    logout() {

        if (sessionStorage.getItem("access_token")) {
            this.revokeToken(sessionStorage.getItem("access_token")).subscribe();
        }

        if (sessionStorage.getItem("access_token_r")) {
            this.revokeToken(sessionStorage.getItem("access_token_r")).subscribe();
        }

        let exTokenString:string = sessionStorage.getItem("oauth_token");
        if (exTokenString!=null) {
            let exToken = JSON.parse(exTokenString);
            this.revokeRefreshToken(exToken.refresh_token).subscribe();

        }

        let exTokenStringR:string = sessionStorage.getItem("oauth_token_r");
        if (exTokenStringR!=null) {
            let exTokenR = JSON.parse(exTokenString);
            this.revokeRefreshToken(exTokenR.refresh_token).subscribe();

        }



        sessionStorage.clear();

        this.access_token = null;
        //sessionStorage.removeItem('access_token');

        this.oauth_token = null;
        //sessionStorage.removeItem('oauth_token');

        this.configuration.htmlElementVisibilidad('divFooter',false);
        this.configuration.htmlElementVisibilidad('divTolbar',false);
        this.configuration.htmlElementVisibilidad('divMenu',false);
        this.configuration.htmlElementVisibilidad('divProfile1',false);
        this.configuration.htmlElementVisibilidad('divProfile2',false);
        this.router.navigate(["/login"]);

        //return Observable.create(true);
    }
}

