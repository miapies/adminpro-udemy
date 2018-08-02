import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceModule } from '../service.module';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: ServiceModule
})
export class LoginGuardGuard implements CanActivate {
  constructor(private _usuario: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    if (this._usuario.estaLogueado()) {
      console.log('Pasó el guard');
      return true;
    } else {
      console.log('Bloqueado por el guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
