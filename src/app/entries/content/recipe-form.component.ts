// import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { EntryService } from '../shared/entry.service';

import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { Cloudinary } from '@cloudinary/angular-4.x';
import $ from "jquery";

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./content.component.css', './recipe-form.component.css']
})

export class RecipeForm {
    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();

    @Input() options: Array<string>;
    @Input() recipe: any;
    @Input() userID: string;
    @Input() token: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    //responses: Array<any>; 
    uploader: FileUploader;
    title: string;
    //_id: string;
    ingredients: string; //back-end will change the ingredients and directions into arrays
    directions: string;
    pic: string;
    href: string;

    progress: number;
    errorMessage: string;
  
    constructor(
      private cloudinary: Cloudinary,
      private zone: NgZone,
      private entryService: EntryService
      //private http: Http
    ) {
      this.progress = 0;
      this.errorMessage = '';
    }
  
    ngOnInit(): void {
      // Create the file uploader, wire it to upload to your account
      const uploaderOptions: FileUploaderOptions = {
        url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
        autoUpload: true, // Upload files automatically upon addition to upload queue
        isHTML5: true, // Use xhrTransport in favor of iframeTransport 
        removeAfterUpload: true, // Calculate progress independently for each uploaded file
        headers: [
          {
            name: 'X-Requested-With',
            value: 'XMLHttpRequest'
          }
        ],
        allowedMimeType: ['image/png', 'image/gif', 'image/jpeg'] 
      };
      this.uploader = new FileUploader(uploaderOptions);
  
      this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
        // Add Cloudinary's unsigned upload preset to the upload form
        form.append('upload_preset', this.cloudinary.config().upload_preset);
        // Add built-in and custom tags for displaying the uploaded photo in the list
        let tags = 'myphotoalbum';
        form.append('tags', tags);
        form.append('file', fileItem);
  
        // Use default "withCredentials" value for CORS requests
        fileItem.withCredentials = false;
        return { fileItem, form };
      };
  
      // Update model on completion of uploading a file
      this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => this.getFileProperties(JSON.parse(response));
        
      // Update model on upload progress event
      this.uploader.onProgressItem = (fileItem: any, progress: any) => this.getProgress(progress);

      this.title = this.recipe.title;
      this.ingredients = this.recipe.ingredients;
      this.directions = this.recipe.directions;
      this.pic = this.recipe.pic;
      this.href = this.recipe.href;

    }

    getProgress(num: number){
      this.progress = num;
    }
  
    getFileProperties(fileProperties: any) {
      if (!fileProperties) return null;
      this.pic = fileProperties.public_id;
    }

    toggle(e){
      //if(e) e.preventDefault();
      this.stateChange.emit('inactive');
    }

    launch(e){
      if(e) e.preventDefault();
      $('#fileupload').click();
    }

    onSubmit(f){
      let result = f.value;
      result.pic = this.pic;

      const valid = Object.keys(result).reduce((a, b) => {
        return a && result[b] !== '';
      }, true);
      console.log(valid);

      if(!valid){
        this.errorMessage = "*Fill out required fields."
      } 
      else{
        this.errorMessage = '';

        const url = `${this.url}/user/${this.userID}/recipe?token=${this.token}`;
        this.entryService.postUser(url, result)
        .then(user => {
            this.userChange.emit(user);
        });
      } 
    }
}