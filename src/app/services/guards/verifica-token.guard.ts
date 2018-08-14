import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceModule } from '../service.module';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: ServiceModule
})
export class VerificaTokenGuard implements CanActivate {
  constructor(private _usuario: UsuarioService, private router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    const token = this._usuario.token;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fechaExp + 1000);
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + 0.5 * 60 * 60 * 1000);

      // console.log(tokenExp.getTime());
      // console.log(ahora.getTime());

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._usuario.renuevaToken().subscribe(
          () => {
            resolve(true);
          },
          () => {
            this.router.navigate(['/login']);
            reject(false);
          }
        );
      }
    });
  }

  expirado(fechaExp: number) {
    const ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
