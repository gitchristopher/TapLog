import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resultEnumPipe'})
export class ResultEnumPipe implements PipeTransform {
  transform(value): Object {
    // tslint:disable-next-line: arrow-return-shorthand
    return Object.keys(value).filter(e => !isNaN(+e)).map(o => { return {index: +o, name: value[o]}; });
  }
}