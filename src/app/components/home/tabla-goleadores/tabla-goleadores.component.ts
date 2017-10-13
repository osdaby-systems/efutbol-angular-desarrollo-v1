import { Component, OnInit } from '@angular/core';
import { TemporadaService } from '../../../services/temporada.service';
// import { UserService } from '../../services/user.service';
import { CategoriaService } from '../../../services/categoria.service';
import { FechaService } from './../../../services/fecha.service';
import * as _ from 'lodash';
import { Categoria } from '../../../models/categoria.model';
import { Fecha } from './../../../models/fecha.model';
import { Temporada } from '../../../models/temporada.models';
import {PersonalService} from '../../../services/personal.service';
import { UserService} from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-tabla-goleadores',
  templateUrl: './tabla-goleadores.component.html',
  styleUrls: ['./tabla-goleadores.component.css']
})
export class TablaGoleadoresComponent implements OnInit {
  public token;

  public temporada_actual: Temporada;
  public arrayCategoria = new Array();
  public categoriaSeleccionada:any;
  public fechaAgrupada:any;
  public fecha:any;
  
  public VerCalendario= false;

  public verVuelta = '1';
  
    public url: string;
    public MiArrayTarjetas;
    public nuevoArrayTarjetasA;
    public MiArrayTarjetasR;
    public nuevoArrayTarjetasR;
    estadoPositivo: Boolean;
    public selectUndefinedOptionValue2:any=undefined;
  

  constructor(
    private _temporadaService: TemporadaService,
    private _categoriaService: CategoriaService,
    private _fechaService: FechaService,
    private _perosnaLService: PersonalService,
    private _userService: UserService
  ) {
    this.url = GLOBAL.url;
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    this.obtenerTemporadas();
  }
  obtenerTemporadas() {
    this.temporada_actual = JSON.parse(localStorage.getItem('Temporada_Actual'));
    console.log("temprada actual");
    console.log(this.temporada_actual);
    this.CategoriasTemporada(this.temporada_actual._id);
  }

  CategoriasTemporada(id:string){
    this._categoriaService.getCategorias().subscribe(
      response => {
        if (!response){
          console.log("No existen categorias");
        }else{
          let i=0;
          for (var index = 0; index < response.length; index++) {
            // console.log("alo 1 "+ response[index].id_temporada + "id: "+ id) ;
            if( response[index].id_temporada == id){
              console.log(" Id de la temporada en categoria "+response[index].id_temporada);
              this.arrayCategoria[i] = response[index];
              i++
            }
          }
          console.log("categoriassssssssssss");
          console.log(response);          
          console.log(this.arrayCategoria);
          this.obtenerCalendario();
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          console.log(body);
        }
        });
  }
  
  obtenerCalendario(){              
      this._fechaService.getFechaByIdCategoria(this.arrayCategoria[0]._id)
      .subscribe((res)=>{            
        if(res){
          this.fecha=res;
          console.log(":D");
          // this.fechaAgrupada = _.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha'));
          
          this.fechaAgrupada = _.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha'));
          console.log(this.fechaAgrupada);
        }else{
          console.log('Fechas no encontradas');
        }
      },(err)=>{
        if(err.status==404){
        }else{             
        }
      });
     
  }
}
