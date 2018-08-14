import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';

@NgModule({
  declarations: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    ModalUploadComponent
  ],
  exports: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    ModalUploadComponent
  ],
  imports: [RouterModule, CommonModule, PipesModule]
})
export class SharedModule {}
