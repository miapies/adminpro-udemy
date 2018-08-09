import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    private _medico: MedicoService,
    private _hospital: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private _modalUpload: ModalUploadService
  ) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this._hospital
      .cargarHospitales(0, true)
      .subscribe((resp: any) => (this.hospitales = resp.hospitales));
    this._modalUpload.notificacion.subscribe(resp => {
      this.medico.img = resp.medico.img;
    });
  }

  cargarMedico(id: string) {
    this._medico.cargarMedico(id).subscribe(medico => {
      // console.log(medico);

      const newMedico = new Medico(
        medico.nombre,
        medico.img,
        medico.usuario ? medico.usuario._id : '',
        medico.hospital ? medico.hospital._id : '',
        medico._id
      );

      this.medico = newMedico;
      this.cambioHospital(this.medico.hospital);
    });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this._medico.guardarMedico(this.medico).subscribe(medico => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });
  }

  cambioHospital(id: string) {
    this._hospital
      .obtenerHospital(id)
      .subscribe((resp: any) => (this.hospital = resp.hospital));
  }

  cambiarFoto() {
    this._modalUpload.mostrarModal('medicos', this.medico._id);
  }
}
