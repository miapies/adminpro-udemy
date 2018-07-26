import { Injectable } from '@angular/core';
import { ServiceModule } from '../service.module';

@Injectable({
  providedIn: ServiceModule
})
export class SharedService {
  constructor() {}
}
