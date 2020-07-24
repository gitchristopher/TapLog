import { Pipe, PipeTransform } from '@angular/core';
import { TapAction } from '../app/taplog-api';

@Pipe({
  name: 'TapActionEnum'
})
export class TapActionEnumPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // tslint:disable-next-line: arrow-return-shorthand
    return TapAction[value];
  }

}
