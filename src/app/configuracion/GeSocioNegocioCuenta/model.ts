import {GeGenericDto} from '../../common/generic.model'
import {GeParametroDto} from '../../configuracion/GeParametro/model'
import {GeMonedaDto} from '../../configuracion/GeMoneda/model'
import {GeSocioNegocioDto} from '../../configuracion/GeSocioNegocio/model'

export class GeSocioNegocioCuentaDto{
    //M001-HVIVES-20170118-Se crea clase GeSocioNegocioCuentaDto para que contengas las variables de un socio de negocio cuenta

    public id: number;
    public socioNegocioDto: GeSocioNegocioDto;
    public bancoDto: GeParametroDto;
    public monedaDto: GeMonedaDto;
    public numCuenta: string;
    public numCuentaCII: string;
    public estado: string;
    public estadoDesc: string;
}