import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayFormat'
})
export class ArrayFormatPipe implements PipeTransform {

  transform(input: [], args?: any): any {
    if (input.length === 0) {
      return '-'
    }
    let output = ''
    for (let item of input) {
      output += item + ', '
    }
    output = output.replace(new RegExp(", $"), "")
    return output
  }

}
