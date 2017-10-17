import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
//import * as cloudinary from 'cloudinary-core';
//import * as cloudJQ from 'cloudinary-jquery-file-upload';
//import { CloudinaryModule } from '@cloudinary/angular-4.x';
//import { CloudinaryModule, CloudinaryConfiguration, provideCloudinary } from '@cloudinary/angular-4.x';
//import { FileUploadModule } from 'ng2-file-upload';

import { FacebookModule } from 'ngx-facebook';
import { NgxGoogleSignInModule } from 'ngx-google-sign-in'
import { AppComponent } from './app.component';

import { EntryListComponent, EntryComponent, EntryService, EntryListModal, HeaderContent, Login, Logout, AddShopping, TextShopping, RecipeForm, DefaultModal } from './entries';

const cloudinaryConfig = {
  cloud_name: 'dhd1eov8v',
  upload_preset: 'r7pixfy9'
};

const appRoutes: Routes = [
  {
    path: '',
    component: HeaderContent
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
    FacebookModule.forRoot(),
    HttpModule,
    //CloudinaryModule.forRoot(cloudinary, cloudinaryConfig as CloudinaryConfiguration),
    //FileUploadModule,
    //CloudinaryModule

  ],
  declarations: [
    AppComponent,
    EntryComponent,
    EntryListComponent,
    EntryListModal,
    HeaderContent,
    Login,
    Logout,
    AddShopping,
    TextShopping,
    RecipeForm,
    DefaultModal
  ],
  providers: [
    EntryService,
    // provideCloudinary(cloudJQ,
    // cloudinaryConfig as CloudinaryConfiguration)
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
