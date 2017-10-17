// import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { EntryService } from '../shared/entry.service';

import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import 'rxjs/add/operator/toPromise';
import { Cloudinary } from '@cloudinary/angular-4.x';

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./content.component.css', './recipe-form.component.css']
})

export class RecipeForm {
    @Output() stateChange = new EventEmitter<any>();
    responses: Array<any>;
  
    hasBaseDropZoneOver: boolean = false;
    uploader: FileUploader;
    // private title: string;
  
    constructor(
      private cloudinary: Cloudinary,
      private zone: NgZone,
      private http: Http
    ) {
      this.responses = [];
      // this.title = '';
    }
  
    ngOnInit(): void {
      // Create the file uploader, wire it to upload to your account
      const uploaderOptions: FileUploaderOptions = {
        url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
        // Upload files automatically upon addition to upload queue
        autoUpload: true,
        // Use xhrTransport in favor of iframeTransport
        isHTML5: true,
        // Calculate progress independently for each uploaded file
        removeAfterUpload: true,
        // XHR request headers
        headers: [
          {
            name: 'X-Requested-With',
            value: 'XMLHttpRequest'
          }
        ]
      };
      this.uploader = new FileUploader(uploaderOptions);
  
      this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
        // Add Cloudinary's unsigned upload preset to the upload form
        //r7pixfy9
        form.append('upload_preset', this.cloudinary.config().upload_preset);
        // Add built-in and custom tags for displaying the uploaded photo in the list
        let tags = 'myphotoalbum';
        // if (this.title) {
        //   form.append('context', `photo=${this.title}`);
        //   tags = `myphotoalbum,${this.title}`;
        // }
        form.append('tags', tags);
        form.append('file', fileItem);
  
        // Use default "withCredentials" value for CORS requests
        fileItem.withCredentials = false;
        return { fileItem, form };
      };
  
      // Insert or update an entry in the responses array
      const upsertResponse = fileItem => {
  
        // Run the update in a custom zone since for some reason change detection isn't performed
        // as part of the XHR request to upload the files.
        // Running in a custom zone forces change detection
        this.zone.run(() => {
          const existingId = this.responses.reduce((prev, current, index) => {
            if (current.file.name === fileItem.file.name && !current.status) {
              return index;
            }
            return prev;
          }, -1);
          if (existingId > -1) {
            // Update existing item with new data
            this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
          } else {
            // Create new response
            this.responses.push(fileItem);
          }
        });
      };
  
      // Update model on completion of uploading a file
      this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
        upsertResponse(
          {
            file: item.file,
            status,
            data: JSON.parse(response)
          }
        );
  
      // Update model on upload progress event
      this.uploader.onProgressItem = (fileItem: any, progress: any) =>
        upsertResponse(
          {
            file: fileItem.file,
            progress,
            data: {}
          }
        );
    }
  
    // updateTitle(value: string) {
    //   this.title = value;
    // }
  
    // Delete an uploaded image
    // Requires setting "Return delete token" to "Yes" in your upload preset configuration
    // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
    deleteImage = function (data: any, index: number) {
      const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
      let headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
      let options = new RequestOptions({ headers: headers });
      const body = {
        token: data.delete_token
      };
      this.http.post(url, body, options)
        .toPromise()
        .then((response) => {
          console.log(`Deleted image - ${data.public_id} ${response.json().result}`);
          // Remove deleted item for responses
          this.responses.splice(index, 1);
        }).catch((err: any) => {
          console.log(`Failed to delete image ${data.public_id} ${err}`);
        });
    };
  
    fileOverBase(e: any): void {
      this.hasBaseDropZoneOver = e;
    }
  
    getFileProperties(fileProperties: any) {
      // Transforms Javascript Object to an iterable to be used by *ngFor
      if (!fileProperties) {
        return null;
      }
      return Object.keys(fileProperties)
        .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
    }

    toggle(e){
      //if(e) e.preventDefault();
      this.stateChange.emit('inactive');
    }
}