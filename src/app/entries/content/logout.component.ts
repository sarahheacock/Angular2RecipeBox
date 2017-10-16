import { Component, AfterViewInit, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./content.component.css']
})

export class Logout {
    @Output() stateChange = new EventEmitter<string>();
    @Output() userChange = new EventEmitter<User>();

    @Input() name: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    toggle(e){
        this.stateChange.emit('inactive');
    }

    signOut(){
        this.entryService.getUser(`${this.url}/auth/logout`)
        .then(user => {
            this.userChange.emit(user);
        });
    }
}