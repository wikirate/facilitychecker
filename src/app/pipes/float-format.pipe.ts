import {Pipe, PipeTransform} from '@angular/core';
import {NumFormatPipe} from "./num-format.pipe";

@Pipe({
  name: 'floatFormat'
})
export class FloatFormatPipe implements PipeTransform {

  transform(input: any, args?: any): any {
    if (typeof input === "string" && !Number.isNaN(Number(input))) {
      input = Number(input)
    } else {
      return input
    }

    if (Number.isNaN(input)) {
      return null;
    }

    return Math.round(input);
  }

}
