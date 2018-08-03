import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTmp: string;

  constructor(private _usuario: UsuarioService) {
    this.usuario = this._usuario.usuario;
  }

  ngOnInit() {}

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;

    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this._usuario.actualizarUsuario(this.usuario).subscribe();
  }

  seleccionImagen(archivo) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (!archivo.type.startsWith('image')) {
      swal(
        'Sólo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => (this.imagenTmp = reader.result);
  }

  cambiarImagen() {
    this._usuario.cambiarImagen(this.imagenSubir, this.usuario._id);
  }
}
