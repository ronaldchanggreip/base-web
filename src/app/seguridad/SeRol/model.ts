import {GeGenericDto} from "../../common/generic.model";
export class SeRolDto extends GeGenericDto{
    public id: number;
    public nombre: string;
    public indAdministrador: boolean;
    public indSys: boolean;
    public estado: string;
    public opciones: string[];
    public treeWebSelected: any;

    public eliminado: boolean;
}