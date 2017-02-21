import {GeGenericDto} from '../../common/generic.model'

export class GeArchivoDto extends GeGenericDto{
  public id: number;
  public registro: number;
  public nombre: string;
  public ruta: string;
  public extension: string;
  public peso: number;
  public detalle: string;
  public indEsAtributo: boolean;
  public estado: boolean;
  public contentType: string;
}