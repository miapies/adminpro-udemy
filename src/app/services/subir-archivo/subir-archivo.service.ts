import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class SubirArchivoService {
  constructor(private http: HttpClient) {}

  subirArchivo(archivo: File, tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // console.log('Imagen subida');
            resolve(JSON.parse(xhr.response));
          } else {
            // console.log('Falló la subida');
            reject(xhr.response);
          }
        }
      };

      const url = URL_SERVICIOS + `/upload/${tipo}/${id}`;

      xhr.open('PUT', url, true);
      xhr.send(formData);
    });
  }

  subirArchivoHttp(archivo: File, tipo: string, id: string) {
    const formData = new FormData();
    formData.append('imagen', archivo, archivo.name);

    const url = URL_SERVICIOS + `/upload/${tipo}/${id}`;

    return this.http.put(url, formData);
  }
}
