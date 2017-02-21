
import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { GeInventoDto, GeInventoArbolDto } from './model'
import { AppConfiguration } from '../../../app/common/app.configuration'
import { Base64 } from '../../../app/common/base64'
import { GeBaseService } from '../../../app/common/base.service'
import { GeGenericConst } from '../../../app/common/generic.const'
import { SelectItem, ConfirmationService, TreeNode } from 'primeng/primeng';

@Injectable()
export class GeInventoService extends GeBaseService {

    constructor(http: Http, configuration: AppConfiguration,geGenericConst:GeGenericConst) {
        super('GeInventoService', 'grupo/', http, configuration, geGenericConst);
    }


    /*Cargamos la data de Inventos para un Arbol deberia venir debase de datos */
    public getsInventarioArbolDto = (): GeInventoArbolDto[] => {
        let l: GeInventoArbolDto[] = [];
        l.push({ id: 0, nombre: 'root', padre: null });
        l.push({ id: 1, nombre: 'Invento1', padre: { id: 0, nombre: 'root', padre: null } },
            { id: 2, nombre: 'Invento2', padre: { id: 0, nombre: 'root', padre: null } },
            { id: 3, nombre: 'Invento3', padre: { id: 0, nombre: 'root', padre: null } }
        );
        l.push({ id: 11, nombre: 'Invento11', padre: { id: 1, nombre: 'Invento1', padre: null } },
            { id: 21, nombre: 'Invento21', padre: { id: 2, nombre: 'Invento2', padre: null } },
            { id: 22, nombre: 'Invento22', padre: { id: 2, nombre: 'Invento2', padre: null } },
            { id: 221, nombre: 'Invento221', padre: { id: 22, nombre: 'Invento22', padre: null } },
            { id: 222, nombre: 'Invento222', padre: { id: 22, nombre: 'Invento22', padre: null } });
        return l;
    }

    public login(username: string, password: string): Observable<any> {

        let url = this.urlSecurity + "token";
        console.log(url);

        //console.log(this.optsSecurity);
        let headersSecurity: Headers = new Headers();
        headersSecurity.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        let appId: string = 'exchangeWeb:monaco'; //ID:Password de la aplciacion cliente
        headersSecurity.append("Authorization","Basic "+ new Base64().encode(appId));
        console.log(headersSecurity);

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', username);
        urlSearchParams.append('password', password);
        urlSearchParams.append('grant_type', 'password');//Grant type de la aplicacion cliente
        let body = urlSearchParams.toString()
        console.log(body);


        return this.http.post(url, body, { headers: headersSecurity })
            .map((res: Response) => res.json()) 
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    /**Llenamos el TreeNode a partir de un Padre obteniendo la informaciond e una lista */
    public recursividad2(idPadre: number, arbol: TreeNode[]) {
        let padre: GeInventoArbolDto = this.buscar(idPadre, this.getsInventarioArbolDto());
        let lst: GeInventoArbolDto[] = this.buscarHijos(idPadre, this.getsInventarioArbolDto());
        let children: TreeNode[] = [];

        for (let l of lst) {
            this.recursividad2(l.id, children);
        }
        arbol.push({ label: padre.nombre, data: padre, expandedIcon: 'ui-icon-folder-open', collapsedIcon: 'ui-icon-folder', children: children });

    }

    /**Busca hijos de un padre */
    public buscarHijos(idPadre: number, lst: GeInventoArbolDto[]): GeInventoArbolDto[] {
        let l: GeInventoArbolDto[] = [];

        for (let x of lst) {
            if (x.padre != null) {
                if (x.padre.id == idPadre) {
                    l.push(x);
                }
            }


        }
        return l;
    }
    /**Busca un registro */
    public buscar(id: number, lst: GeInventoArbolDto[]): GeInventoArbolDto {
        let l: GeInventoArbolDto;

        for (let x of lst) {

            if (x.id == id) {
                l = x;
                return x;
            }
        }
    }

    /*
    public gets  = (dto: GeInventoDto): Observable<GeInventoDto[]> => {        
        return this.http.get(this.url + "gets")
            .map((response: Response) => 
                <GeGrupoParametroDto[]>response.json());
    }

    public get = (id: number): Observable<GeGrupoParametroDto> => {
        return this.http.get(this.url + "getsId/" + id)
            .map((response: Response) => <GeGrupoParametroDto>response.json())
            .catch((error:any) => this.handleError(error));
    }

    public save = (dto: GeGrupoParametroDto): Observable<GeGrupoParametroDto> => {       
        return this.http.post(this.url + "save", dto, this.opts)
            .map((response: Response) => <GeGrupoParametroDto>response.json())
            .catch((error:any) => this.handleError(error));
    }    

    public delete = (dto: GeGrupoParametroDto): Observable<GeGrupoParametroDto> => {
        return this.save(dto);
    }*/

}