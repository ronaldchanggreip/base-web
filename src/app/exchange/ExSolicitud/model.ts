import {GeGenericDto} from '../../common/generic.model'
import {GeMonedaDto} from '../../configuracion/GeMoneda/model';
import {GeSocioNegocioCuentaDto} from '../../configuracion/GeSocioNegocioCuenta/model';
import {GeSocioNegocioDto} from '../../configuracion/GeSocioNegocio/model';
import {ExTipoCambioDto} from '../ExTipoCambio/model';
import {GeParametroDto} from '../../configuracion/GeParametro/model';
import {ExCuentaEmpresaDto} from '../ExCuentaEmpresa/model';

export class ExSolicitudDto extends GeGenericDto{
    public transaccion: string;
    public socioNegocioDto: GeSocioNegocioDto;
    public monedaOrigenDto: GeMonedaDto;
    public monedaDestinoDto: GeMonedaDto;
    public cBancariaDestinoDto: GeSocioNegocioCuentaDto;
    public tipoCambioDto: ExTipoCambioDto;
    public importeOrigen: number;
    public importeDestino: number;
    public numVoucherOrigen: string;
    public numVoucherDestino: string;
    public bancoOrigenDto: GeParametroDto;
    public bancoDestinoDto: GeParametroDto;
    public cEmpOrigenDto: ExCuentaEmpresaDto;
    public cEmpDestinoDto: ExCuentaEmpresaDto;
    public estado: string;
    public etapa: string;
    public etapaDesc: string;
    public estadoDesc: string;
    public flagConfirm: boolean;
}
