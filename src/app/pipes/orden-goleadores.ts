import { element } from 'protractor';
import * as _ from 'lodash';
import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
    name: 'OrdenGoleadores'
  })

  export class OrdenGoleadores  {
          
      transform(array, args?: string) {
        return _.orderBy(array, ['TotalGoles'], ['desc']);
          
      

        // return array.filter(element => {                                               
        //   });        

        // array.forEach((element,i) => {
            //     array[i].nombre_equipo=element.nombre_equipo+':D';
            // }); 
            // return array;
      }
    
}