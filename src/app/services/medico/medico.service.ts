import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS, LIMIT_GET } from '../../config/config';
import { map } from 'rxjs/operators';
import { Medico } from '../../models/medico.model';
import swal from 'sweetalert';

@Injectable({
  providedIn: ServiceModule
})
export class MedicoService {
  token: string;

  constructor(private http: HttpClient, private _usuario: UsuarioService) {
    this._usuario.cargarStorage();
    this.token = this._usuario.token;
  }

  cargarMedicos(desde: number = 0) {
    const url = URL_SERVICIOS + `/medico?desde=${desde}&limit=${LIMIT_GET}`;

    return this.http.get(url);
  }

  borrarMedico(id: string) {
    const url = URL_SERVICIOS + `/medico/${id}?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(() => {
        swal(
          'Médico borrado',
          'El médico ha sido eliminado correctamente',
          'success'
        );
        return true;
      })
    );
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += `/${medico._id}?token=${this.token}`;

      return this.http.put(url, medico).pipe(
        map((resp: any) => {
          swal('Médico actualizado', medico.nombre, 'success');
          return resp.medico;
        })
      );
    } else {
      // Creando
      url += `?token=${this.token}`;

      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          swal('Médico creado', medico.nombre, 'success');
          return resp.medico;
        })
      );
    }
  }

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + `/medico/${id}`;

    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  }

  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + `/busqueda/coleccion/medicos/${termino}`;

    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }

  obtenerMedico(id: string) {
    const url = URL_SERVICIOS + `/medico/${id}`;

    return this.http.get(url);
  }
}
