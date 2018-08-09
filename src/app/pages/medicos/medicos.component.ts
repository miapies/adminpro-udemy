import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { LIMIT_GET } from '../../config/config';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0;
  limit_desde = LIMIT_GET;

  totalRegistros: number = 0;
  paginas: any[] = [];
  cargando: boolean = true;

  constructor(
    private _medico: MedicoService,
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
    this.cargarMedicos();
    this._modalUpload.notificacion.subscribe(() => this.cargarMedicos());
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
    this.cargarMedicos();
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
    this.cargarMedicos();
  }

  mostrarModal(id: string) {
    this._modalUpload.mostrarModal('medicos', id);
  }

  cargarMedicos() {
    this.cargando = true;

    this._medico.cargarMedicos(this.desde).subscribe(
      (resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
        // console.log(this.medicos);
        this.calcularPaginas();
        this.cargando = false;
      },
      error => {
        console.log(error);
        this.cargando = false;
      }
    );
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      // console.log(borrar);

      if (borrar) {
        this._medico.borrarMedico(medico._id).subscribe((borrado: boolean) => {
          // console.log(borrado);
          if (
            this.desde >= this.limit_desde &&
            this.totalRegistros - this.desde === 1
          ) {
            this.desde -= this.limit_desde;
          }

          this.cargarMedicos();
        });
      }
    });
  }

  buscarMedico(termino: string) {
    if (!termino || termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    // console.log(termino);
    this._medico.buscarMedicos(termino).subscribe(
      (medicos: Medico[]) => {
        // console.log(medicos);
        this.medicos = medicos;
        this.totalRegistros = medicos.length;
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
