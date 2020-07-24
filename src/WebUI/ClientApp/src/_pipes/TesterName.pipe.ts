import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TesterName'
})
export class TesterNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split('@', 1);
  }

}
