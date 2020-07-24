import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TapActionToArray'
})
export class TapActionToArrayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Object.keys(value).filter(e => !isNaN(+e)).map(o => ({index: +o, name: value[+o]}));
  }

}
