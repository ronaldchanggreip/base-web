import{SeUsuarioDto} from '../../seguridad/SeUsuario/model'

export class GeBitacoraDto {
    public id: number;
    public registro: number;
    public fecha: string;
    public tipMovimiento: string;
    public usuarioDto: SeUsuarioDto;
    public estado: string;
    public terminal: string;
    public activo: boolean;
    public detalle: string;
    public etapa: string;
    public tipoMovimientoDesc: string;
    public estadoDesc: string;
    public etapaDesc: string;

}