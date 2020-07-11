import { Pipe, PipeTransform } from '@angular/core';
import { Result } from '../app/taplog-api';

@Pipe({name: 'resultEnum'})
export class ResultEnumPipe implements PipeTransform {
  transform(value): string {
    // tslint:disable-next-line: arrow-return-shorthand
    return Result[value];
  }
}