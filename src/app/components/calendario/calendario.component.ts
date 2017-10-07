import { Sancion } from './../../models/sancion.model';
import { element } from 'protractor';
import { Personal } from './../../models/personal.model';
import { Component, OnInit } from '@angular/core';
import { SancionService } from './../../services/sancion.service';
import { TemporadaService } from '../../services/temporada.service';
import { UserService } from '../../services/user.service';
import { CategoriaService } from '../../services/categoria.service';
import { FechaService } from './../../services/fecha.service';
import * as _ from 'lodash';
import { Categoria } from '../../models/categoria.model';
import { Fecha } from './../../models/fecha.model';
import { Temporada } from '../../models/temporada.models';

import { EstadioService } from '../../services/estadio.service';

import { Estadio } from '../../models/estadio.model';

import { GLOBAL } from '../../services/global';

import * as jsPDF from  'jspdf';
import * as $ from 'jquery';
import * as html2canvas from 'html2canvas';

import swal from 'sweetalert2';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  public selectUndefinedOptionValue2:any;


  public nombresEquiposCategoria: any;

  public Vocalia = false;

  public arrayPersonal1 = new Array(25);
  public arrayPersonal2= new Array(25);

  public datosVocalia : any;
  public categoriaActual: string;

  public p: number = 1;

  public partidosSuspencionEquipo1 = new Array();
  public partidosSuspencionEquipo2 = new Array();


  public token;
  public temporada_actual: Temporada;
  public fecha:any;
  public plantilla:any;
  public fechaAgrupada: any;

  public f: Fecha;
  public fechas= new Array(this.f);

  public fechaAgrupadaT1:any;
  public fechaAgrupadaT2:any;
  public fechaAux:any;
  public arrayCategoria = new Array();
  public generarSelectJugadoresGoles1: any;
  public generarSelectJugadoresTA1: any;
  public generarSelectJugadoresTR1: any;
  public generarSelectJugadoresGoles2: any;
  public generarSelectJugadoresTA2: any;
  public generarSelectJugadoresTR2: any;
  public categoriaSeleccionada:any;

  public estadios: Estadio[];
  public estadioSelec: string;

  public id_Habilitar: String;
  public partidoJugado= false;

  public VerCalendario= false;

  public primeraVuelta= new Array();
  public segundaVuelta= new Array();

  public primeraVueltaClasificada : any;
  public fechaAgrupadaSegundaVuelta: any;

  // public primeraVuelta= new Array(new Array());
  // public segundaVuelta= new Array(new Array());

  public verVuelta = '1';
  public url: string;

  public sanciones:Sancion;
  constructor(
    private _userService: UserService,
    private _temporadaService: TemporadaService,
    private _categoriaService: CategoriaService,
    private _fechaService: FechaService,
    private _estadioService: EstadioService,
    private _sancionService: SancionService
  ) {
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

   ngOnInit() {
    this.obtenerTemporadas();
    this.obtenerEstadios();
    // this.getSancion();
  }

  // getSancion(){
  //   this._sancionService.getSancion()
  //   .subscribe((res)=>{
  //     console.log(res);
  //     this.sanciones=res;
  //   },(err)=>{
  //     console.log("Error");
  //     console.log(err);
  //     if(err.status!=404)
  //     {
  //       swal(
  //         'Oops...',
  //         '¡Algo salio mal, pruebe despues de un momento!',
  //         'error'
  //       )
  //     }
  //   });
  // }

  obtenerEstadios(){
    this._estadioService.getEstadios().subscribe(
      response =>{
        if(!response){
          console.log("Error al traer estadios");
        }else{
          this.estadios = response;
        }
      },
      error =>{

      });
  }

  selectEstadio(estadioSeleccionado,e){
    console.log(estadioSeleccionado);
    console.log(e);
    this.estadioSelec=estadioSeleccionado;
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
          console.log("Equipos");
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
    this.categoriaActual = e.target.value;
    this.p = 1;
    this.categoriaSeleccionada = e;
    this.obtenerCalendario(e);
  }

  // *ngFor="let fec of fechaAgrupada"
  obtenerCalendario(e){
    if(e.target.selectedIndex!=0)
      {
        console.log(e.target.selectedIndex);
        let index=e.target.selectedIndex-1;
        this.nombresEquiposCategoria = this.arrayCategoria[index].codigo_equipo;
        // console.log(this.nombresEquiposCategoria);
          this._fechaService.getFechaByIdCategoriaAdministrador(this.arrayCategoria[index]._id)
          .subscribe((res)=>{
            if(res){
              this.fecha=res;
              this.fechaAgrupadaT1=JSON.stringify(this.fecha.fechasEncontradas[2]);

              // this.fechaAux=this.fecha.fechasEncontradas;
              console.log(":D");
              // console.log(_.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha')));

              //  let LongF=this.fechaAux.length;
              //  this.fechaAgrupadaT1=this.fechaAux.splice(0,LongF/2);
              //  console.log(_.values(_.groupBy(this.fechaAux,'n_fecha')));
              //  console.log("##");
              //  console.log(_.values(_.groupBy(this.fechaAgrupadaT1,'n_fecha')));
              // console.log(this.fecha.fechasEncontradas);
              console.log(this.fecha.fechasEncontradas);
              this.fechaAgrupada=_.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha'));
              console.log(this.fechaAgrupada);
              // console.log(a);
              // this.fechaAgrupadaT1=_.values(_.groupBy(_.chunk(this.fecha.fechasEncontradas,2)[0],'n_fecha'));
              // console.log(_.values(_.groupBy(_.chunk(_.values(this.fecha.fechasEncontradas),2),'n_fecha')));
              // console.log(_.chunk(_.values(this.fecha.fechasEncontradas),2));
              // if(this.arrayCategoria[index].segunda_vuelta){
              //   this.fechaAgrupadaT2=_.values(_.groupBy(_.chunk(this.fecha.fechasEncontradas,2)[1],'n_fecha'));
              // }

              // console.log(_.values(_.groupBy(this.fecha.fechasEncontradas,'n_fecha'))[0]);
              // console.log(_.groupBy([{a:1,j:"j"},{a:2,j:"b"},{a:1,j:":D"}],'a'));
              // _.chain(this.standings)
              // .groupBy('division')
              // .toPairs()
              // .map(item => _.zipObject(['divisionName','divisionStandings'],item))
              // .value();

              this.VerCalendario = true;
              // console.log(this.fechaAgrupada);
              console.log('Hay segunda Vuelta? ' + this.arrayCategoria[index].segunda_vuelta);
              let val1 = 0;
              let val2 = 0;

              //Reiniciar los array
              this.primeraVuelta = new Array();
              this.segundaVuelta = new Array();

              if( this.arrayCategoria[index].segunda_vuelta == true){
                this.fechaAgrupada.forEach(element => {
                  element.forEach(ele => {
                    if(ele.primera_segunda == 1){
                      if(ele.id_equipo1 != null && ele.id_equipo2 !=null){
                        this.primeraVuelta[val1] = ele;
                        val1++;
                      }
                    }else{
                      if(ele.id_equipo1 != null && ele.id_equipo2 !=null){
                        this.segundaVuelta[val2] = ele;
                        val2++;
                      }
                    }
                  });
                });
                this.primeraVueltaClasificada = _.values(_.groupBy(this.primeraVuelta, 'n_fecha'));
                this.fechaAgrupadaSegundaVuelta = _.values(_.groupBy(this.segundaVuelta, 'n_fecha'));
                console.log(this.primeraVueltaClasificada);
                console.log(this.fechaAgrupadaSegundaVuelta);
              this.fechaAgrupada = this.primeraVueltaClasificada;
              console.log('Primera Vuelta: ' + this.primeraVuelta);
              console.log('Segunda Vuelta: ' + this.segundaVuelta);
              this.fechas = this.fechaAgrupada;

              }else{
                this.fechas = this.fechaAgrupada;
                console.log('Array de tipo fechas:');
                console.log(this.fechas);
                console.log("Un sola vuelta");
                this.verVuelta = '1';
                console.log('Primera Vuelta: ' + this.primeraVuelta);
                console.log('Segunda Vuelta: ' + this.segundaVuelta);

              }

            }else{
              console.log("Fechas no encontradas");
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

  generarGoles1(GOL1: number,fecha){
    fecha.goles_equipo1 = new Array(GOL1);
  }
  generarTA1(TA1: number,fecha){
    fecha.tarjetas_amarilla_equipo1 = new Array(TA1);
  }
  generarTR1(TR1: number,fecha){
    fecha.tarjetas_roja_equipo1 = new Array(TR1);
  }
  generarGoles2(GOL2: number,fecha){
    fecha.goles_equipo2 = new Array(GOL2);
  }
  generarTA2(TA2: number,fecha){
  fecha.tarjetas_amarilla_equipo2 = new Array(TA2);
  }
  generarTR2(TR2: number,fecha){
    fecha.tarjetas_roja_equipo2 = new Array(TR2);
  }

  guardarFecha(fechas,r){
    console.log(fechas);
    // fechas.forEach(element => {
    //   if(element.primera_segunda==r)
    //   {
    //     element.jugado=true;
    //     this._fechaService.updateCalendario(this.token,element,element._id)
    //     .subscribe((response)=>{
    //       console.log(response);
    //     },(err)=>{
    //         swal(
    //           'Oops...',
    //           '¡Algo salio mal, pruebe despues de un momento!',
    //           'error'
    //         )
    //     });
    //   }

    // });
    // this.obtenerCalendario(this.categoriaSeleccionada);
  }

  HabilitarResultados(id){
    this.id_Habilitar = id;
    this.partidoJugado = true;
  }
  DesabilitarResultados(){
    this.id_Habilitar = '';
    this.partidoJugado = false;
  }


  guardarPartido(partido,estadio,fecha){
    console.log("Partido: ");
    console.log('Fin PAARTIDO');
    let data1 = new Array();
    let data2 = new Array();
    console.log(this.partidosSuspencionEquipo1);
    console.log(this.partidosSuspencionEquipo2);
    let arrayIdsEquipo1 = partido.tarjetas_roja_equipo1;
    let arrayIdsEquipo2 = partido.tarjetas_roja_equipo2;
    console.log(arrayIdsEquipo1);
    console.log(arrayIdsEquipo2);
    partido.tarjetas_roja_equipo1 = new Array();
    partido.tarjetas_roja_equipo2 = new Array();
    for (var index = 0; index < this.partidosSuspencionEquipo1.length; index++) {
        data1[index] = {
          'partidosSuspendidos' : this.partidosSuspencionEquipo1[index],
          'id' : arrayIdsEquipo1[index]
        }
    }
    for (var index = 0; index < this.partidosSuspencionEquipo2.length; index++) {
      data2[index] = {
        'partidosSuspendidos' : this.partidosSuspencionEquipo2[index],
        'id' : arrayIdsEquipo2[index]
      }
  }
    console.log(data1);
    partido.tarjetas_roja_equipo1 = data1;
    partido.tarjetas_roja_equipo2 = data2;

    console.log(partido);

    console.log("estadio:" + estadio._id);
    if(this.estadioSelec == ''){
      partido.id_estadio = estadio;
    }else{
      partido.id_estadio = this.estadioSelec;
    }
    partido.fecha = fecha;
    partido.estado_fecha = this.partidoJugado;
    partido.jugado = this.partidoJugado;
    console.log(partido);

    this._fechaService.updateCalendario(this.token,partido,partido._id).subscribe(
      response =>{
        if(!response){
          swal(
             'Error',
             '¡El servidor no responde!',
             'error'
             );
        }else{
            swal(
              'Guardado',
              'Exitosamente',
              'success'
            );
            this.partidoJugado = false;
            this.estadioSelec = '';
            console.log(response);
            this.partidosSuspencionEquipo1 = new Array();
            this.partidosSuspencionEquipo2 = new Array();
        }
      },
      error =>{

      }
    );

    // let fechaModificada: Fecha;
    // fechaModificada = partido;
    // fechaModificada.estado_fecha = true;
    // fechaModificada.id_estadio = this.estadioSelec;
    // console.log(fechaModificada);
  }

  calendarioVuelta(value: string){
    this.verVuelta = value;
    this.p = 1;
  }

  b(){
    console.log(this.arrayPersonal1);
    console.log(this.arrayPersonal2);
    let i=54;
    let j=0;
    let k=0;
    let nombres1 = new Array();
    let nombres2 = new Array();
    let temporadaActual = this.temporada_actual.nombre_temporada;
    for (var index = 0; index < this.arrayPersonal1.length; index++) {
      if(this.arrayPersonal1[index] != undefined){
      nombres1[j]= this.arrayPersonal1[index].apellido_personal + ' ' + this.arrayPersonal1[index].nombre_personal;
      j++;
      }
    }
    for (var inde = 0; inde < this.arrayPersonal2.length; inde++) {
      console.log('Alo');
      if(this.arrayPersonal2[inde] != undefined){
      nombres2[k]= this.arrayPersonal2[inde].apellido_personal + ' ' + this.arrayPersonal2[inde].nombre_personal;
      k++;
      }
    }
    // let nombre = this.arrayPersonal1[0].apellido_personal + ' ' + this.arrayPersonal1[0].nombre_personal;
    // this.demoFromHTML();
    console.log(nombres1);
    console.log(nombres2);
    var img;
    var doc = new jsPDF()
    
  //   // console.log(this.arrayPersonal1)
  //   // let ctx=this;
    html2canvas($('#hojaVocalia')[0]).then(function(canvas) {
    //   console.log(":D");
     var img = canvas.toDataURL("image/png");
     doc.addImage(img,'PNG',5,5);

     doc.setFontSize(14);
     doc.text(temporadaActual,60,12);
     doc.setFontSize(11);
     doc.text('#J',6,46);
     doc.text('#J',106,46);
     doc.text('APELLIDOS NOMBRES',16,46);
     doc.text('APELLIDOS NOMBRES',115,46);
     doc.setFontSize(8);
     doc.text('GOL',77,46);
     doc.text('TARJETAS',86,43);
     doc.text('GOL',176,46);
     doc.text('TARJETAS',186,43);
     doc.setFontSize(7);
     doc.text('#Cambio',7,200);
     doc.text('#JUGADOR INGRESA',25,200);
     doc.text('#JUGADOR SALE',60,200);
     doc.text('UNO',9,206)  ;
     doc.text('DOS',9,212);
     doc.text('TRES',9,218);
     doc.text('CUATRO',7,224);

     doc.text('#Cambio',107,200);
     doc.text('#JUGADOR INGRESA',124,200);
     doc.text('#JUGADOR SALE',158,200);
     doc.text('UNO',108,206)  ;
     doc.text('DOS',108,212);
     doc.text('TRES',108,218);
     doc.text('CUATRO',106,224);
      //  doc.text(nombres1[0],15,55);
      //  doc.text(nombres1[1],15,61);
      //  doc.text(nombres1[2],15,67);
      //  doc.text(nombres1[3],15,72);
      //  doc.text(nombres1[4],15,78);
      //  doc.text(nombres1[5],15,84);
      //  doc.text(nombres1[6],15,90);
      //  doc.text(nombres1[7],15,96);
      //  doc.text(nombres1[8],15,102);
      //  doc.text(nombres1[9],15,107);
      //  doc.text(nombres1[10],15,113);
      //  doc.text(nombres1[11],15,119);
      //  doc.text(nombres1[12],15,125);
      //  doc.text(nombres1[13],15,131);
      //  doc.text(nombres1[14],15,136);
      //  doc.text(nombres1[15],15,142);
      //  doc.text(nombres1[16],15,148);
      //  doc.text(nombres1[17],15,154);
      //  doc.text(nombres1[18],15,160);
      //  doc.text(nombres1[19],15,166);
      //  doc.text(nombres1[20],15,172);
      //  doc.text(nombres1[21],15,177);
      //  doc.text(nombres1[22],15,183);
      //  doc.text(nombres1[23],15,189);
      //  doc.text(nombres1[24],15,195);

      if(nombres2.length != 0 ){
       let l= 55;
       doc.text(nombres2[0],113,l);
       for (var x = 1; x < nombres2.length; x++) {
         if(x==2 || x== 9 || x==13 || x==20 ){
          l=l+5;
         }
         else{
          l=l+6
         }
         doc.text(nombres2[x],113,l);
       }
      }
      if(nombres1.length != 0 ){
        let m= 55;
        doc.text(nombres1[0],15,m);
        for (var y = 1; y < nombres1.length; y++) {
          if(y==2 || y== 9 || y==13 || y==20 ){
           m=m+5;
          }
          else{
           m=m+6
          }
          doc.text(nombres1[y],15,m);
        }
       }

  //   //  doc.fromHTML($('#prueba')[0],35, 25)
    
  //   let i=0;
    
  //   this.arrayPersonal1.forEach(element => {
  //     doc.text('HOLAS' ,i,45+i);
  //     i=i+30;
  //   });
  //   // ctx.pdf = doc.output('datauristring')
  //   //  console.log(doc.output('datauristring'));
  // doc.setFontSize(12);
  
  // doc.text(this.arrayPersonal1[1].nombre_personal,10,30);
  doc.save('vocalia.pdf');
  
  });
  
  
  
  }

  demoFromHTML() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    // var text= document.getElementById("Text1").value;
    // pdf.text(100, 225, text);
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
  let  source = $('#hojaVocalia')[0];

    // we support special element handlers. Register them with jQuery-style
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors
    // (class, of compound) at this time.
   let specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
  let   margins = {
        top: 10,
        bottom: 10,
        left: 10,
        rigth: 10,
        width: 522
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
    source, // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top, 
    { // y coord
        'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandlers
    },

    function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        pdf.save('Test.pdf');
    },margins);
}





  datos(data){
    this.arrayPersonal1 = new Array(25);
    this.arrayPersonal2 = new Array(25);
    let i = 0;
    let j = 0;
    this.Vocalia = true;
    this.datosVocalia = data;
    this.datosVocalia.estadio = 'NO ASIGNADO';
    this.datosVocalia.categoria = this.categoriaActual;
    console.log(data);
    for (var index = 0; index < this.estadios.length; index++) {
      if(this.estadios[index]._id === data.id_estadio){
        console.log('Si hay estadio');
        this.datosVocalia.estadio = this.estadios[index].nombre_estadio;
        break;
      }
    }
    data.id_equipo1.personal_equipo.forEach(element => {
      if(element.rol_personal === 'jugador'){
        this.arrayPersonal1[i] = element;
        i++;
      }
    });

    this.arrayPersonal1 = _.orderBy(this.arrayPersonal1,['apellido_personal'],['asc']);
    data.id_equipo2.personal_equipo.forEach(element => {
      if(element.rol_personal === 'jugador'){
        this.arrayPersonal2[j] = element;
        j++;
      }
    });
    // this.arrayPersonal2 = _.orderBy(this.arrayPersonal2,['nombre_personal'],['asc']);
    this.arrayPersonal2 = _.orderBy(this.arrayPersonal2,['apellido_personal'],['asc']);


  }
}

