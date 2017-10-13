// import { element } from 'protractor';
import { Personal } from './../../models/personal.model';
import { Component, OnInit } from '@angular/core';

import { TemporadaService } from '../../services/temporada.service';
// import { UserService } from '../../services/user.service';
import { CategoriaService } from '../../services/categoria.service';
import { FechaService } from './../../services/fecha.service';
import * as _ from 'lodash';
import { Categoria } from '../../models/categoria.model';
import { Fecha } from './../../models/fecha.model';
import { Temporada } from '../../models/temporada.models';
import {PersonalService} from '../../services/personal.service';
import { UserService} from '../../services/user.service';

import { GLOBAL } from '../../services/global';

import swal from 'sweetalert2';
import {OrdenEquipota} from '../../pipes/orden-equipo-ta';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {

  public token;

  p: number = 1;
  // public selectUndefinedOptionValue2:any;
  
  public temporada_actual: Temporada;
  public arrayCategoria = new Array();
  public categoriaSeleccionada:any;
  public fechaAgrupada:any;
  public fecha:any;
  // public fechaAgrupadaT1:any;
  public VerCalendario= false;

  // public primeraVuelta= new Array();
  // public segundaVuelta= new Array();

  // public primeraVueltaClasificada : any;
  // public fechaAgrupadaSegundaVuelta: any;
  // public fechasPriemraVuelta: Fecha[];

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
    this.temporada_actual = this.temporada_actual = JSON.parse(localStorage.getItem('Temporada_Actual'));
    this.CategoriasTemporada(this.temporada_actual._id);
    // this._temporadaService.getTemporadas().subscribe(
    //   response => {
    //     if (!response) {
    //       // this.validarTemporadas = false;
    //     } else {
    //       response.forEach(element => {
    //         if ( element.estado_temporada ) {
    //           this.temporada_actual = element;
    //           console.log(this.temporada_actual);              
    //         }
    //       });
    //     this.CategoriasTemporada(this.temporada_actual._id);
    //     }
    //   },
    //   error => {
    //     var errorMessage = <any>error;
    //     if (errorMessage != null) {
    //       var body = JSON.parse(error._body);
    //       console.log(body);
    //     }
    //   }
    // );
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
          console.log(response);          
          console.log(this.arrayCategoria);
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
  onChangeCategoria(e){
    this.categoriaSeleccionada=e;
    this.obtenerCalendario(e);
    // this.p = 1;
  }
  
  // *ngFor="let fec of fechaAgrupada"
  obtenerCalendario(e){    
    if(e.target.selectedIndex!=0)
      {        
        console.log(e.target.selectedIndex);
        let index=e.target.selectedIndex-1;        
          this._fechaService.getFechaByIdCategoria(this.arrayCategoria[index]._id)
          .subscribe((res)=>{            
            if(res){
              
              this.fecha=res;
              console.log(this.fecha);
              console.log(":D");
              this.fechaAgrupada = _.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha'));
              
              this.pruebasTarjetas1(this.fechaAgrupada);

              this.VerCalendario = true;
            
            }else{
              console.log('Fechas no encontradas');
            }
          },(err)=>{
            if(err.status==404){
              swal(
                'Calendario',
                '¡No existe un calendario para esta categoría.!',                
              )
            }else{
              swal(
                'Oops...',
                '¡Algo salio mal, pruebe despues de un momento!',
                'error'
              )
            }
          });
      }else{
        console.log("No se ha seleccionado una categoria.");        
      }
  }


  // calendarioVuelta(value: string){
  //   this.verVuelta = value;
  //   this.p = 1;
  // }

  pruebasTarjetas1(todasFechas) {
    console.log("Todas las Fechas de esta categoria");
    console.log(todasFechas);

    this.MiArrayTarjetas = new Array();
    this.MiArrayTarjetasR = new Array();
    let i=0;
    let TR=0;

    todasFechas.forEach(element => {
        element.forEach(elem => {
        if(elem.tarjetas_amarilla_equipo1.length != 0){
          for (var index = 0; index < elem.tarjetas_amarilla_equipo1.length; index++) {
            // console.log(elem.tarjetas_amarilla_equipo1)
            this.MiArrayTarjetas[i] = {
              'id': elem.tarjetas_amarilla_equipo1[index]._id,
              'datosJugador' : elem.tarjetas_amarilla_equipo1[index],
              'datosEquipo': elem.id_equipo1.nombre_equipo
            }
            i=i+1;
          }
        }
        if(elem.tarjetas_amarilla_equipo2.length !=0){
          for (var ind = 0; ind < elem.tarjetas_amarilla_equipo2.length; ind++) {
            this.MiArrayTarjetas[i] = {
              'id': elem.tarjetas_amarilla_equipo2[ind]._id,
              'datosJugador' : elem.tarjetas_amarilla_equipo2[ind],
              'datosEquipo': elem.id_equipo2.nombre_equipo
            }
            i=i+1;
          }
        }
        if(elem.tarjetas_roja_equipo1.length != 0){
          for (var x = 0; x < elem.tarjetas_roja_equipo1.length; x++) {
            this.MiArrayTarjetasR[TR] = {
              'numero_fecha':elem.n_fecha,
              'fecha':elem.fecha,
              'datosJugador': elem.tarjetas_roja_equipo1[x].id,
              'partidosSuspendidos': elem.tarjetas_roja_equipo1[x].partidosSuspendidos,
              'datosEquipo': elem.id_equipo1.nombre_equipo
            }
            TR = TR + 1;
          }
        }
        if(elem.tarjetas_roja_equipo2.length != 0){
          for (var y = 0; y < elem.tarjetas_roja_equipo2.length; y++) {
            this.MiArrayTarjetasR[TR] = {
              'numero_fecha':elem.n_fecha,
              'fecha':elem.fecha,
              'datosJugador': elem.tarjetas_roja_equipo2[y].id,
              'partidosSuspendidos': elem.tarjetas_roja_equipo2[y].partidosSuspendidos,
              'datosEquipo': elem.id_equipo2.nombre_equipo
            }
            TR = TR + 1;
          }
        }

      });
    });

    // console.log("Array agrupado");
    this.MiArrayTarjetas = _.values(_.groupBy(this.MiArrayTarjetas, 'id'));
    this.MiArrayTarjetasR = _.values(_.groupBy(this.MiArrayTarjetasR, 'numero_fecha'));
    
    // this.MiArrayTarjetas = _.values(_.groupBy(this.MiArrayTarjetas, 'datosEquipo'));
    // console.log(this.MiArrayTarjetas);
    
    console.log("Array de Tarjetas AMARILLAS");
    console.log(this.MiArrayTarjetas);
    console.log("Array de Tarjetas ROJAS");
    console.log(this.MiArrayTarjetasR);

    this.nuevoArrayTarjetasA = new Array();
    let j=0;
    this.MiArrayTarjetas.forEach(element => {
      // console.log(element[0]);
      this.nuevoArrayTarjetasA[j]={
        'EquipoJugador':element[0].datosEquipo,
        'DatosJugador':element[0].datosJugador,
        'TotalAmarillas':element.length
      }
      j++
    });

    console.log(this.nuevoArrayTarjetasA);

  }

  cambiarEstadoJugador(Jugador){
    console.log(Jugador);
    //actualizar al jugador
    this._perosnaLService.updatePersonalTarjetaAmarilla(this.token, Jugador._id, Jugador.estado_personal)
    .subscribe(
      res => {
        console.log(res);
        if(!res.personaActualizada){
          console.log('Error al actualizar');
          swal(
            'Error',
            '¡El servidor no responde!',
            'error'
            );
        }else{
          swal(
            'Jugador',
            'Modificado',
            'success'
          );
        }
      },
      error => {

      }
    );
  }
}
