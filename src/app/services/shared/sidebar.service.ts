import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';

@Injectable({
  providedIn: ServiceModule
})
export class SidebarService {
  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Gráficas', url: '/graficas1' }
      ]
    }
  ];

  constructor() {}
}
