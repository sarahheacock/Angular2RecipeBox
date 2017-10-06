import { Entry } from './entry.model';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EntryService {
    @Output() onStateChange: EventEmitter<any> = new EventEmitter();
    @Output() onContentChange: EventEmitter<any> = new EventEmitter();
    modalShown: string = 'active';
    modalContent: string = "Loading";
    user: { name:string; token:string; } = {
        name: '',
        token: ''
    };

    constructor(private http: HttpClient){
        if(window.location.search){
            const arr = window.location.search.split('userName');
            this.user = {
                name: arr[1].replace(/%20/g, ' '),
                token: arr[0].replace('?token=', '')
            };
            window.sessionStorage.setItem('user', JSON.stringify(this.user));
            if(this.user.name) window.location.href = window.location.origin + "/";
            //console.log(this.user);
        }
        else if(window.sessionStorage.user){
            const user = JSON.parse(window.sessionStorage.user);
            this.user = {
                name: user.name,
                token: user.token
            };
            //window.location.pathname = '';
        }

        //window.location.pathname = '';
    }
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";


    getEntries(): Promise<any[]> {
        console.log("get");
        return this.http.get(`${this.url}/api/scrape`)
            .toPromise()
            .then(response => response['data'] as any[]);
    }

    changeContent(str){
        this.modalContent = str;
        this.onContentChange.emit(this.modalContent);
        this.toggleState();
    }

    getContent(){
        return this.onContentChange;
    }

    toggleState() {
        this.modalShown = (this.modalShown === 'inactive') ? 'active': 'inactive';
        console.log(this.modalShown);
        this.onStateChange.emit(this.modalShown);
    }

    getState() {
        return this.onStateChange;
    }
}
