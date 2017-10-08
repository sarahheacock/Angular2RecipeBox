import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import * as cloudinary from 'cloudinary-core';
import { CloudinaryModule } from '@cloudinary/angular-4.x';

import { FacebookModule } from 'ngx-facebook';
//import {GoogleSignInComponent} from 'angular-google-signin';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { EntryListComponent, EntryComponent, EntryService, EntryListModal, HeaderContent, ContentModal, Login } from './entries';

const appRoutes: Routes = [
  {
    path: '',
    component: EntryListComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    //NgbModule.forRoot(),
    FacebookModule.forRoot(),
    CloudinaryModule.forRoot(cloudinary, {
        cloud_name: 'dhd1eov8v'
    })
  ],
  declarations: [
    AppComponent,
    EntryComponent,
    EntryListComponent,
    EntryListModal,
    HeaderContent,
    ContentModal,
    Login,
    //GoogleSignInComponent
  ],
  providers: [EntryService],
  bootstrap: [AppComponent]
})

export class AppModule { }
