import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'splitT'
  })
  export class SplitT implements PipeTransform {
    transform(val:string, params:string[]):string {

      var splitList = val.split(params[0]);
      var date = splitList[0]; 
      var time = splitList[1]; 
        return date + "  " + time.substring(0,5);
    }
  }