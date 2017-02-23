import {GeGenericDto} from '../../common/generic.model'
import {GeParametroDto} from '../../configuracion/GeParametro/model';
import {GeMonedaDto} from '../../configuracion/GeMoneda/model';

export class ExCuentaEmpresaDto extends GeGenericDto{
    public bancoDto: GeParametroDto;
    public monedaDto: GeMonedaDto;
    public cuenta: string;
    public saldo: number;
    public estado: string;
    public estadoDesc: string;
    public cuentaInter: string;
}