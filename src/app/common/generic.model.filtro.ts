
export class GeFiltroDto {
    //M001-RCHANG-20161201-Se crea clase GeFiltroDto para los filtros de las entidades.

    public order: boolean;
    public fplantilla: boolean;
    public plantilla: string;
    public filtros: GeFiltroDetaDto[];
    public orders: GeFiltroOrderDto[];
    public limit: boolean;
    public first: number;
    public max: number;

    constructor () {
        this.filtros = [];
        this.orders = [];
    }

}

export class GeFiltroOrderDto {
    //M001-RCHANG-20161201-Se crea clase GeGenericDto para que todos los Dtos extiendan de este.

    public campo: string;
    public direccion: string;

    constructor(campo: string,direccion:string) {
        this.campo = campo;
        this.direccion = direccion;
    }
}

export class GeFiltroDetaDto {
    //M001-RCHANG-20161201-Se crea clase GeFiltroDetaDto para el detalle de los filtros.

    public campo: string;
    public operador: string;
    public valor: string;
    public tipoDato: string;

    constructor(campo: string,operador:string, tipoDato: string, valor: string) {
        this.campo = campo;
        this.operador = operador;
        this.valor = valor;
        this.tipoDato = tipoDato;
    }
}