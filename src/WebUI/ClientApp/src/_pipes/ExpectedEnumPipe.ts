import { Pipe, PipeTransform } from '@angular/core';
import { Expected } from '../app/taplog-api';

@Pipe({name: 'expectedEnum'})
export class ExpectedEnumPipe implements PipeTransform {
  transform(value): string {
    // tslint:disable-next-line: arrow-return-shorthand
    return Expected[value];
  }
}