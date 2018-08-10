import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { ServiceModule } from '../service.module';

@Injectable({
  providedIn: ServiceModule
})
export class AdminGuard implements CanActivate {
  constructor(private _usuario: UsuarioService) {}

  canActivate() {
    if (this._usuario.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this._usuario.logout();
      return false;
    }
  }
}
