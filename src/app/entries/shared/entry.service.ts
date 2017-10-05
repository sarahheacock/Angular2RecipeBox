import { Entry } from './entry.model';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
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
    modalContent: string = 'Loading';

    constructor(private http: Http){ }
    private url = "http://localhost:3000";


    getEntries(): Promise<any[]> {
        console.log("get");
        return this.http.get(`${this.url}/api/scrape`)
            .toPromise()
            .then(response => response.json().data as any[]);
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
