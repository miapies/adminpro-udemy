import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS, LIMIT_GET } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: ServiceModule
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _subirArchivo: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  private borrarStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    localStorage.removeItem('id');
  }

  private guardarStorage(
    id: string,
    token: string,
    usuario: Usuario,
    menu: any
  ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += `?token=${this.token}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('Token renovado');

        return true;
      }),
      catchError(err => {
        this.router.navigate(['/login']);
        swal('No se pudo renovar el token', err.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  estaLogueado() {
    return this.token && this.token.length > 5 ? true : false;
  }

  logout() {
    this.usuario = null;
    this.token = null;

    this.borrarStorage();

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
    );
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
      catchError(err => {
        swal('Error en el login', err.error.mensaje, 'error');
        return throwError(err);
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    const url =
      URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;
    // console.log(url);

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        if (usuario._id === this.usuario._id) {
          const usuarioDB = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }

        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    // this._subirArchivo
    //   .subirArchivo(archivo, 'usuarios', id)
    //   .then(resp => {
    //     console.log(resp);
    //   })
    //   .catch(resp => {
    //     console.log(resp);
    //   });
    this._subirArchivo.subirArchivoHttp(archivo, 'usuarios', id).subscribe(
      (resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      },
      error => console.log(error)
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + `/usuario?desde=${desde}&limit=${LIMIT_GET}`;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + `/busqueda/coleccion/usuarios/${termino}`;

    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(resp => {
        swal(
          'Usuario borrado',
          'El usuario ha sido eliminado correctamente',
          'success'
        );
        return true;
      })
    );
  }
}
