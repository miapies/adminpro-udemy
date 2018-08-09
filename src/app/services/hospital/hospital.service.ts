import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';
import { URL_SERVICIOS, LIMIT_GET } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: ServiceModule
})
export class HospitalService {
  token: string;

  constructor(private http: HttpClient, private _usuario: UsuarioService) {
    this._usuario.cargarStorage();
    this.token = this._usuario.token;
  }

  cargarHospitales(desde: number = 0, sinLimite?: boolean) {
    let url = URL_SERVICIOS + `/hospital?desde=${desde}`;

    if (!sinLimite) {
      url += `&limit=${LIMIT_GET}`;
    }

    return this.http.get(url);
  }

  borrarHospital(id: string) {
    const url = URL_SERVICIOS + `/hospital/${id}?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(resp => {
        swal(
          'Hospital borrado',
          'El hospital ha sido eliminado correctamente',
          'success'
        );
        return true;
      })
    );
  }

  crearHospital(nombre: string) {
    const url = URL_SERVICIOS + `/hospital?token=${this.token}`;

    return this.http.post(url, { nombre }).pipe(
      map((resp: any) => {
        swal('Hospital creado', nombre, 'success');
        return resp.hospital;
      })
    );
  }

  actualizarHospital(hospital: Hospital) {
    const url =
      URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this.token;

    return this.http.put(url, hospital).pipe(
      map(() => {
        swal('Hospital actualizado', hospital.nombre, 'success');
        return true;
      })
    );
  }

  buscarHospitales(termino: string) {
    const url = URL_SERVICIOS + `/busqueda/coleccion/hospitales/${termino}`;

    return this.http.get(url).pipe(map((resp: any) => resp.hospitales));
  }

  obtenerHospital(id: string) {
    const url = URL_SERVICIOS + `/hospital/${id}`;

    return this.http.get(url);
  }
}
