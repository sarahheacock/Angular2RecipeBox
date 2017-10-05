import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import * as cloudinary from 'cloudinary-core';
import { CloudinaryModule } from '@cloudinary/angular-4.x';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { EntryListComponent, EntryComponent, EntryService, EntryListModal, EntryListButton, ContentModal } from './entries';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    component: EntryListComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    //RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    CloudinaryModule.forRoot(cloudinary, {
        cloud_name: 'dhd1eov8v'
    })
  ],
  declarations: [
    AppComponent,
    EntryComponent,
    EntryListComponent,
    EntryListModal,
    EntryListButton,
    ContentModal
  ],
  providers: [EntryService],
  bootstrap: [AppComponent]
})

export class AppModule { }
