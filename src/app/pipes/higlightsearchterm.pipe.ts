import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'highlightSearchTerm'
})

export class HighlightSearchTerm implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!args) {
      return value;
    }
    // @ts-ignore
    var re = new RegExp(args, 'i'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    return value.replace(re, "<mark style='color: red'>$&</mark>");
  }
}
