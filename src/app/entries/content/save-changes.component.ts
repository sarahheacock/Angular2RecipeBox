import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';
// import { NgForm } from '@angular/forms';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-save-changes',
    template: `
    <div class="modal-body text-center">
        <div class="pad-button">
            <h5 *ngIf="!done && !start">Would you like to like to save changes?</h5>
            <i *ngIf="!done && start" class="fa fa-spinner fa-spin fa-2x"></i>
            <h5 *ngIf="done && start">Changes Saved!</h5>
        </div>
    </div>
    <div class="modal-footer">
        <button *ngIf="!start" class="btn btn-primary" (click)="onSave($event)">
            Save Changes
        </button>
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})


export class SaveChanges {
    start:boolean = false;
    done:boolean = false;

    @Output() stateChange = new EventEmitter<string>();
    @Output() userChange = new EventEmitter<User>();

    @Input() user: User

    @Input() data: {
        phone: Array<string>;
        shoppingListNames: Array<string>;
        shoppingList: Array<{name:string; selected:boolean;}>;
    };

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}


    onSave(e){
        if(!this.start){
            const url = `${this.url}/user/${this.user._id}/list?token=${this.user.userID}`;
            this.start = true;
    
            this.entryService.putUser(url, this.data).then(user => {
                this.userChange.emit(user);
                //this.user = user;
                this.done = true;
            });
        }
    }


    toggle(e){
        //this.userChange.emit(this.user);
        this.stateChange.emit('inactive');
    }
}