// Exact copy of contact.awesome.pipe
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'GeActivoInactivo' })
/** Necesita un boolean y retorna ACTIVO o INACTIVO*/
export class GeActivoInactivo implements PipeTransform {
    transform(valor: string) {
        return valor == 'A' ? 'ACTIVO ' : 'INACTIVO';
    }
}

