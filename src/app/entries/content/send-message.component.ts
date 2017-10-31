import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-send-message',
    template: `
    <div class="modal-body text-center">
        <i *ngIf="!done" class="fa fa-spinner fa-spin fa-2x"></i>
        <p *ngIf="done && message" class="">Message Sent!</p>
        <p *ngIf="done && !message" class="">Changes Saved!</p>
    </div>
    <div class="modal-footer">
        <button *ngIf="done" type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})


export class SendMessage implements OnInit{
    @Output() userChange = new EventEmitter<User>();
    @Input() user: User;
    @Input() ingredients: {
        send: string;
        phone: Array<string>;
        shoppingListNames: Array<string>;
        shoppingList: Array<{name:string; selected:boolean;}>;
    };

    done:boolean = false;
    message:boolean;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    ngOnInit(){
        this.message = (this.ingredients.send !== undefined);
        console.log(this.message);
        
        if(this.message){
            const url = `${this.url}/user/${this.user._id}/message?token=${this.user.userID}`;
            this.entryService.postUser(url, this.ingredients).then(user => {
                //this.stateChange.emit('inactive');
                //this.userChange.emit(user);
                this.user = user;
                this.done = true;
            });
        }
        else {
            const url = `${this.url}/user/${this.user._id}/list?token=${this.user.userID}`;
            this.entryService.putUser(url, this.ingredients).then(user => {
                //this.stateChange.emit('inactive');
                //this.userChange.emit(user);
                this.user = user;
                this.done = true;
            });
        }
    }

    toggle(e){
        //console.log("toggle");
        this.userChange.emit(this.user);
    }
}