import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { LIMIT_GET } from '../../config/config';

declare var swal;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;
  limit_desde = LIMIT_GET;

  totalRegistros: number = 0;
  paginas: any[] = [];
  cargando: boolean = true;

  constructor(
    private _hospital: HospitalService,
    public _modalUpload: ModalUploadService
  ) {}

  private calcularPaginas() {
    let cont = 0;
    this.paginas = new Array();
    for (
      let i = 0;
      i < Math.ceil(this.totalRegistros / this.limit_desde);
      i++
    ) {
      const pagina = {
        numero: i + 1,
        desde: cont,
        active: this.desde === cont
      };

      this.paginas.push(pagina);
      cont += this.limit_desde;
    }
  }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUpload.notificacion.subscribe(() => this.cargarHospitales());
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    // console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  cambiarPagina(pagina: number) {
    if (pagina >= this.totalRegistros) {
      return;
    }

    if (pagina < 0) {
      return;
    }

    if (pagina === this.desde) {
      return;
    }

    this.desde = pagina;
    this.cargarHospitales();
  }

  mostrarModal(id: string) {
    this._modalUpload.mostrarModal('hospitales', id);
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospital.cargarHospitales(this.desde).subscribe(
      (resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
        this.calcularPaginas();
        // console.log(this.paginas);
        this.cargando = false;
      },
      error => {
        console.log(error);
        this.cargando = false;
      }
    );
  }

  guardarHospital(hospital: Hospital) {
    this._hospital.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar a ${hospital.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      // console.log(borrar);

      if (borrar) {
        this._hospital
          .borrarHospital(hospital._id)
          .subscribe((borrado: boolean) => {
            // console.log(borrado);
            if (
              this.desde >= this.limit_desde &&
              this.totalRegistros - this.desde === 1
            ) {
              this.desde -= this.limit_desde;
            }

            this.cargarHospitales();
          });
      }
    });
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Introduzca el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: ['Cancelar', 'Crear'],
      // buttons: true,
      dangerMode: true
    }).then((valor: string) => {
      if (!valor || valor.length === 0) {
        return;
      }

      this._hospital
        .crearHospital(valor)
        .subscribe(() => this.cargarHospitales());
    });
  }

  buscarHospital(termino: string) {
    if (!termino || termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    // console.log(termino);
    this._hospital.buscarHospitales(termino).subscribe(
      (hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
        this.totalRegistros = hospitales.length;
        this.paginas = [];
        this.cargando = false;
      },
      error => {
        console.log(error);
        this.cargando = false;
      }
    );
  }
}
