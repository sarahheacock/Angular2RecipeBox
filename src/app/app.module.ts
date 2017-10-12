import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import {HttpModule} from '@angular/http';
import * as cloudinary from 'cloudinary-core';
//import { CloudinaryModule } from '@cloudinary/angular-4.x';
import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-4.x';
import {FileUploadModule} from 'ng2-file-upload';

import { FacebookModule } from 'ngx-facebook';
import { NgxGoogleSignInModule } from 'ngx-google-sign-in'
// import { AuthService, AppGlobals } from 'angular2-google-login';
//import {GoogleSignInComponent} from 'angular-google-signin';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { EntryListComponent, EntryComponent, EntryService, EntryListModal, HeaderContent, ContentModal, Login, Logout, AddShopping, TextShopping, RecipeForm } from './entries';

const appRoutes: Routes = [
  {
    path: '',
    component: EntryListComponent
  },
  { path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    //NgxGoogleSignInModule.forRoot(),
    //NgbModule.forRoot(),
    FacebookModule.forRoot(),
    HttpModule,
    CloudinaryModule.forRoot(cloudinary, {
        cloud_name: 'dhd1eov8v',
        upload_preset: 'r7pixfy9'
    }),
    FileUploadModule

  ],
  declarations: [
    AppComponent,
    EntryComponent,
    EntryListComponent,
    EntryListModal,
    HeaderContent,
    ContentModal,
    Login,
    Logout,
    AddShopping,
    TextShopping,
    RecipeForm
  ],
  providers: [
    EntryService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
