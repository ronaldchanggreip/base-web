import {GeGenericDto} from '../../common/generic.model'
import {GeParametroDto} from '../../configuracion/GeParametro/model';
import {GeMonedaDto} from '../../configuracion/GeMoneda/model';

export class ExTipoCambioDto extends GeGenericDto{
    public id:number;
    public tipo:string;
    public bancoDto:GeParametroDto;
    public monedaDestinoDto:GeMonedaDto;
    public monedaOrigenDto:GeMonedaDto;
    public factor:number;
    public tipoDesc: string; 
    public fechaVigencia: Date = new Date();
    public strFechaVigencia: string;
    public difRespectoExchange: number;

    public precioVenta:number;
    public precioVentaDif:number;
    public precioCompra:number;
    public precioCompraDif:number;
}

