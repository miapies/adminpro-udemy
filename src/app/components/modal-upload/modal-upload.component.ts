import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTmp: any;

  constructor(
    private _subirArchivo: SubirArchivoService,
    public _modalUpload: ModalUploadService
  ) {}

  ngOnInit() {}

  cerrarModal() {
    this.imagenTmp = null;
    this.imagenSubir = null;
    const input: any = document.getElementById('inputUpload');
    if (input) {
      input.value = null;
    }

    this._modalUpload.ocultarModal();
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

  subirImagen() {
    this._subirArchivo
      .subirArchivoHttp(
        this.imagenSubir,
        this._modalUpload.tipo,
        this._modalUpload.id
      )
      .subscribe(
        resp => {
          this._modalUpload.notificacion.emit(resp);
          this.cerrarModal();
        },
        error => {
          console.error('Error en la carga...', error);
        }
      );
  }
}
