import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent {
  progreso1: number = 20;
  progreso2: number = 30;

  constructor() {}

  // actualizar(event: number) {
  //   console.log('Evento: ', event);
  //   this.progreso1 = event;
  // }
}
