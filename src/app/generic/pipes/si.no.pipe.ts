// Exact copy of contact.awesome.pipe
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'GeSiNoPipe' })
/** Necesita un boolean y retorna SI o NO */
export class GeSiNoPipe implements PipeTransform {
  transform(valor: Boolean) {
    return valor ? 'SI ' : 'NO';
  }
}

