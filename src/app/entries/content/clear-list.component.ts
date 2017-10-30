import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-clear-list',
    template: `
    <div class="modal-body">
        <div class="pad-button">
            <p class="text-center">Are you sure you would like to clear your shopping list?</p>
            <button class="btn btn-outline-danger btn-block" (click)="clear($event)">Clear Shopping List <i class="fa fa-trash"></i></button>
        </div>
        <br />
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})


export class ClearList {
    @Output() stateChange = new EventEmitter<string>();
    @Output() userChange = new EventEmitter<User>();

    @Input() _id: string;
    @Input() token: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    clear(e){
        const url = `${this.url}/user/${this._id}/clear?token=${this.token}`;
        
        this.entryService.putUser(url, {}).then(user => {
            //this.stateChange.emit('inactive');
            this.userChange.emit(user);
        });
    }

    toggle(e){
        this.stateChange.emit('inactive');
    }
}