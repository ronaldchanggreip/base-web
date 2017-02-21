import { Injectable, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { GeMensajeHttpDto } from '../generic/error/error.model'



@Injectable()
export class GeGenericConst {
    //M001-RCHANG-20161201-Se crea clase GeGenericConst para constantes genericas

    //Monedas
    public codMonedaDolar = 10002;
    public codMonedaSol = 10001;
    public codMonedaEuro = 10004;
    /*--10001 sole
     --10002 dolares
     --10004 euro*/

    //Ubigeo
    public codUbigeoDefault = 174;

    //Roles
    public codRolWeb = 300;

    //Entidades
    public entSistSolicitud = 2007;

    //Codigos de error personalizados en las apis
    public codStatusOK: number = 200;
    public codErrorController: number = 599;
    public codErrorService: number = 598;
    public codErrorValidacion200:number = 291;
    public codErrorValidacion400:number = 491;
    public codErrorValidacionNoBlock200:number = 292;

    //Constantes de Tipos de Datos Disponibles
    public tdNinguno = { "codigo": 'G', descripcion: 'Ninguno' };
    public tdCaracter = { "codigo": 'C', descripcion: 'Caracter' };
    public tdReal = { "codigo": 'N', descripcion: 'Real' };
    public tdEntero = { "codigo": 'E', descripcion: 'Entero' };
    public tdFecha = { "codigo": 'D', descripcion: 'Fecha' };
    public tdBoolean = { "codigo": 'B', descripcion: 'Boolean' };

    //Constantes de Filtros
    public filtroSeleccionar = { "codigo": -1, descripcion: 'Seleccione' };
    public filtroNinguno = { "codigo": -2, descripcion: 'Ninguno' };

    //Constantes de Tipos de Grupos de Parametros
    public tgpNegocio = { "codigo": 'N', descripcion: 'Negocio' };
    public tgpSistema = { "codigo": 'S', descripcion: 'Sistema' };

    //Constantes de tipo de cambio
    public tcCompra = { "codigo": 'C', descripcion: 'Compra' };
    public tcTVenta = { "codigo": 'V', descripcion: 'Venta' };

    //Constantes de estado activ e inactiv
    public estActivo = { "codigo": 'A', descripcion: 'Activo' };
    public estInactivo = { "codigo": 'I', descripcion: 'Inactivo' };
    public estSuspendida = { "codigo": 'S', descripcion: 'Suspendido' };

    //Constantes etapas solicitud
    public ESTSOL_COD_PENDIENTE = "P";
    public ESTSOL_DESC_PENDIENTE = "PENDIENTE";
    public ESTSOL_COD_OBSERVADA = "O";
    public ESTSOL_DESC_OBSERVADA = "OBSERVADA";
    public ESTSOL_COD_ANULADA = "A";
    public ESTSOL_DESC_ANULADA = "ANULADA";
    public ESTSOL_COD_ABORTADA = "B";
    public ESTSOL_DESC_ABORTADA = "ABORTADA";
    public ESTSOL_COD_REVISADA = "R";
    public ESTSOL_DESC_REVISADA = "REVISADA";
    public ESTSOL_COD_EJECUTADA = "E";
    public ESTSOL_DESC_EJECUTADA = "EJECUTADA";
    public ESTSOL_COD_VALIDADA= "V";
    public ESTSOL_DESC_VALIDADA= "VALIDADA";

    //Constantes estados solicitud
    public ETAPASOL_COD_REGISTRO = "R";
    public ETAPASOL_DESC_REGISTRO = "REGISTRO";
    public ETAPASOL_COD_REVISION = "E";
    public ETAPASOL_DESC_REVISION = "REVISION";
    public ETAPASOL_COD_VALIDACION = "V";
    public ETAPASOL_DESC_VALIDACION = "VALIDACION";
    public ETAPASOL_COD_EJECUCION = "J";
    public ETAPASOL_DESC_EJECUCION = "EJECUCION";

    //Constantes de grupos de parametros para uso de la aplicacion
    public grpBanco:number = 10005;
    public grpTipoDoc:number = 10010;
    
    //Constantes de parametros
    public paramTipoDocDni = 10024;
    public paramTipoDocRuc = 10025;
    public paramBancoExExpress = 10027;
    
    //Constantes Operadores de Filtros
    public opeEq: string = "=";
    public opeNeq: string = "<>";
    public opeMay: string = ">";
    public opeMen: string = "<";
    public opeMayEq: string = ">=";
    public opeMenEq: string = "<=";
    public opeLike: string = "like";

    public ordAsc: string = 'ASC';
    public ordDes: string = 'DESC';

    //content types que se pre visualizan en un dialog
    public cTypesDialog = ["image/jpeg", "image/png", "image/jpg"];
    //content types que se previsualizan en un iframe
    public cTypesIframe = ["application/pdf"];
    //content types que no se previsualizan
    public cTypesNoPrev = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    constructor() {
        
    }

    public getSitEstadoSolicitud(): SelectItem[] {
        let sitEtapa: SelectItem[] = [];
        sitEtapa.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });

        sitEtapa.push({ value: this.ESTSOL_COD_PENDIENTE, label: this.ESTSOL_DESC_PENDIENTE });
        sitEtapa.push({ value: this.ESTSOL_COD_OBSERVADA, label: this.ESTSOL_DESC_OBSERVADA });
        sitEtapa.push({ value: this.ESTSOL_COD_ANULADA, label: this.ESTSOL_DESC_ANULADA });
        sitEtapa.push({ value: this.ESTSOL_COD_ABORTADA, label: this.ESTSOL_DESC_ABORTADA });
        sitEtapa.push({ value: this.ESTSOL_COD_REVISADA, label: this.ESTSOL_DESC_REVISADA });
        sitEtapa.push({ value: this.ESTSOL_COD_VALIDADA, label: this.ESTSOL_DESC_VALIDADA });
        sitEtapa.push({ value: this.ESTSOL_COD_EJECUTADA, label: this.ESTSOL_DESC_EJECUTADA });
        return sitEtapa;
    }

    public getSitEtapaSolicitud(): SelectItem[] {
        let sitEstado: SelectItem[] = [];
        sitEstado.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });

        sitEstado.push({ value: this.ETAPASOL_COD_REGISTRO, label: this.ETAPASOL_DESC_REGISTRO });
        sitEstado.push({ value: this.ETAPASOL_COD_REVISION, label: this.ETAPASOL_DESC_REVISION });
        sitEstado.push({ value: this.ETAPASOL_COD_VALIDACION, label: this.ETAPASOL_DESC_VALIDACION });
        sitEstado.push({ value: this.ETAPASOL_COD_EJECUCION, label: this.ETAPASOL_DESC_EJECUCION });
        return sitEstado;
    }

    //Metodo que permite obnter un arreglo de SelectItem de Grupos de Parametros tipo=1>Formulario tipo=2>Busquedas
    public getSitTipoGrupoParametro(tipo: number): SelectItem[] {
        let sitTiposGrupoParametro: SelectItem[] = [];
        if (tipo == 1) { //Para un formulario
            sitTiposGrupoParametro.push({ label: this.filtroSeleccionar.descripcion, value: this.filtroSeleccionar.codigo });
        } else if (tipo == 2) { //Para busqueda
            sitTiposGrupoParametro.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });
        }

        sitTiposGrupoParametro.push({ label: this.tgpNegocio.descripcion, value: this.tgpNegocio.codigo });
        sitTiposGrupoParametro.push({ label: this.tgpSistema.descripcion, value: this.tgpSistema.codigo });

        return sitTiposGrupoParametro;
    }

    //Metodo que permite obnter un arreglo de SelectItem de tipo de cambio tipo=1>Formulario tipo=2>Busquedas
    public getSitTipoCambio(tipo: number): SelectItem[] {
        let sitTipoCambio: SelectItem[] = [];
        if (tipo == 1) { //Para un formulario
            sitTipoCambio.push({ label: this.filtroSeleccionar.descripcion, value: this.filtroSeleccionar.codigo });
        } else if (tipo == 2) { //Para busqueda
            sitTipoCambio.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });
        }

        sitTipoCambio.push({ label: this.tcCompra.descripcion, value: this.tcCompra.codigo });
        sitTipoCambio.push({ label: this.tcTVenta.descripcion, value: this.tcTVenta.codigo });

        return sitTipoCambio;
    }

    public getSitEstadoActivInactivSusp(tipo: number): SelectItem[] {
        let sitTipoActivInact: SelectItem[] = [];
        if (tipo == 1) { //Para un formulario
            sitTipoActivInact.push({ label: this.filtroSeleccionar.descripcion, value: this.filtroSeleccionar.codigo });
        } else if (tipo == 2) { //Para busqueda
            sitTipoActivInact.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });
        }

        sitTipoActivInact.push({ label: this.estActivo.descripcion, value: this.estActivo.codigo });
        sitTipoActivInact.push({ label: this.estInactivo.descripcion, value: this.estInactivo.codigo });
        sitTipoActivInact.push({ label: this.estSuspendida.descripcion, value: this.estSuspendida.codigo });

        return sitTipoActivInact;
    }

    public getSitEstadoActivInactiv(tipo: number): SelectItem[] {
        let sitTipoActivInact: SelectItem[] = [];
        if (tipo == 1) { //Para un formulario
            sitTipoActivInact.push({ label: this.filtroSeleccionar.descripcion, value: this.filtroSeleccionar.codigo });
        } else if (tipo == 2) { //Para busqueda
            sitTipoActivInact.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });
        }

        sitTipoActivInact.push({ label: this.estActivo.descripcion, value: this.estActivo.codigo });
        sitTipoActivInact.push({ label: this.estInactivo.descripcion, value: this.estInactivo.codigo });

        return sitTipoActivInact;
    }

    //Metodo que permite obnter un arreglo de SelectItem de Tipos de Datos tipo=1>Formulario tipo=2>Busquedas
    public getSitTipoDatoParametro(tipo: number): SelectItem[] {
        let sit: SelectItem[] = [];
        if (tipo == 1) { //Para un formulario
            sit.push({ label: this.filtroSeleccionar.descripcion, value: this.filtroSeleccionar.codigo });
        } else if (tipo == 2) { //Para busqueda
            sit.push({ label: this.filtroNinguno.descripcion, value: this.filtroNinguno.codigo });
        }

        sit.push({ label: this.tdCaracter.descripcion, value: this.tdCaracter.codigo });
        sit.push({ label: this.tdReal.descripcion, value: this.tdReal.codigo });
        sit.push({ label: this.tdEntero.descripcion, value: this.tdEntero.codigo });
        sit.push({ label: this.tdFecha.descripcion, value: this.tdFecha.codigo });
        sit.push({ label: this.tdBoolean.descripcion, value: this.tdBoolean.codigo });

        return sit;
    }

    public getSitTipoDatoParametro2(): SelectItem[] {
        let sit: SelectItem[] = [];
        sit.push({ label: this.tdNinguno.descripcion, value: this.tdNinguno.codigo });
        sit.push({ label: this.tdCaracter.descripcion, value: this.tdCaracter.codigo });
        sit.push({ label: this.tdReal.descripcion, value: this.tdReal.codigo });
        sit.push({ label: this.tdEntero.descripcion, value: this.tdEntero.codigo });
        sit.push({ label: this.tdFecha.descripcion, value: this.tdFecha.codigo });
        sit.push({ label: this.tdBoolean.descripcion, value: this.tdBoolean.codigo });

        return sit;
    }

}