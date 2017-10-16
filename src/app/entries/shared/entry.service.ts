import { User } from './entry.model';
import { Injectable, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { GoogleSignInProviderService } from 'ngx-google-sign-in';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// declare var gapi: any;

@Injectable()
export class EntryService {
    constructor(private http: HttpClient){}

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    // ===============RECIPES==================================
    getEntries(): Promise<any[]> {
        return this.http.get(`${this.url}/api`)
            .toPromise()
            .then(response => response['box'] as any[]);
    }

    postUser(url, obj): Promise<User> {
        return this.http.post(url, obj)
        .toPromise()
        .then(response => response as User);
    }

    getUser(url): Promise<User> {
        return this.http.get(url)
        .toPromise()
        .then(response => response as User);
    }
}
