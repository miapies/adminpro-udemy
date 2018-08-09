import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { LIMIT_GET } from '../../config/config';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  limit_desde = LIMIT_GET;

  totalRegistros: number = 0;
  paginas: any[] = [];
  cargando: boolean = true;

  constructor(
    private _usuario: UsuarioService,
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
    this.cargarUsuarios();
    this._modalUpload.notificacion.subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this._modalUpload.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuario.cargarUsuarios(this.desde).subscribe(
      (resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
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
    this.cargarUsuarios();
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
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (!termino || termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    // console.log(termino);
    this._usuario.buscarUsuarios(termino).subscribe(
      (usuarios: Usuario[]) => {
        // console.log(usuarios);
        this.usuarios = usuarios;
        this.totalRegistros = usuarios.length;
        this.paginas = [];
        this.cargando = false;
      },
      error => {
        console.log(error);
        this.cargando = false;
      }
    );
  }

  borrarUsuario(usuario: Usuario) {
    // console.log(usuario);

    if (usuario._id === this._usuario.usuario._id) {
      swal(
        'No puede borrar usuario',
        'No se puede borrar el usuario que está logueado',
        'error'
      );

      return;
    }

    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      // console.log(borrar);

      if (borrar) {
        this._usuario
          .borrarUsuario(usuario._id)
          .subscribe((borrado: boolean) => {
            // console.log(borrado);
            if (
              this.desde >= this.limit_desde &&
              this.totalRegistros - this.desde === 1
            ) {
              this.desde -= this.limit_desde;
            }

            this.cargarUsuarios();
          });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuario.actualizarUsuario(usuario).subscribe();
  }
}
