import { element } from 'protractor';
import * as _ from 'lodash';
import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
    name: 'OrdenEquipota'
  })

  export class OrdenEquipota  {
          
      transform(array, args?: string) {
        return _.orderBy(array, ['EquipoJugador'], ['desc']);
          
      

        // return array.filter(element => {                                               
        //   });        

        // array.forEach((element,i) => {
            //     array[i].nombre_equipo=element.nombre_equipo+':D';
            // }); 
            // return array;
      }
    
}