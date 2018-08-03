import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: ServiceModule
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _subirArchivo: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  private guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  private cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
  }

  estaLogueado() {
    return this.token && this.token.length > 5 ? true : false;
  }

  logout() {
    this.usuario = null;
    this.token = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
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
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    const url =
      URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;
    // console.log(url);

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        // this.usuario = resp.usuario;
        const usuarioDB = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
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
        this.guardarStorage(id, this.token, this.usuario);
      },
      error => console.log(error)
    );
  }
}
