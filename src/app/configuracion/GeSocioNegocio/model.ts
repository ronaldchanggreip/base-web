import {GeGenericDto} from '../../common/generic.model'
import {GeParametroDto} from '../../configuracion/GeParametro/model'
import {GeUbigeoDto} from '../../configuracion/GeUbigeo/model'

export class GeSocioNegocioDto extends GeGenericDto{
    //M001-HVIVES-20170118-Se crea clase GeSocioNegocio para que contengas las variables de un socio de negocio

    public tipoDocumentoDto: GeParametroDto;
    public numDocumento: string;
    public nombres: string;
    public apPaterno: string;
    public apMaterno: string;
    public razSocial: string;
    public nombreCompleto: string;
    public descripcion: string;
    public indCliente: boolean;
    public indProveedor: boolean;
    public telefPrincipal: string;
    public anexoPrincipal: string;
    public telefSecundario: string;
    public anexoSecundario: string;
    public movilPrincipal: string;
    public movilSecundario: string;
    public nacionalidadDto: GeUbigeoDto;
    public indClienteDesc: string;
    public indProveedorDesc: string;
    public estado: string;
}