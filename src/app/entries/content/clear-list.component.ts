import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-clear-list',
    template: `
    <div class="modal-body">
        <div class="pad-button">
            <h5 class="text-center">Are you sure you would like to clear your shopping list?</h5>
            <h5>Clearing your shopping list is permanent.</h5>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-danger" (click)="clear($event)">Clear Shopping List <i class="fa fa-trash"></i></button>
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Cancel</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})


export class ClearList {
    @Output() modalChange = new EventEmitter<{
        title: string;
        data: {
            shoppingList: Array<{name:string; selected:boolean;}>;
            shoppingListNames: Array<string>
        }
    }>();
    @Output() userChange = new EventEmitter<User>();

    @Input() user: User;
    @Input() data: {
        shoppingList: Array<{name:string; selected:boolean;}>;
        shoppingListNames: Array<string>
    };


    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    clear(e){
        if(e) e.preventDefault();
        this.data.shoppingList = [];
        this.data.shoppingListNames = [];
        
        const url = `${this.url}/user/${this.user._id}/clear?token=${this.user.userID}`;
        this.entryService.putUser(url, {}).then(user => {
            this.userChange.emit(user);
            
            this.modalChange.emit({
                title: "Shopping List",
                data: this.data
            });
        });
    }

    toggle(e){
        if(e) e.preventDefault();
        console.log(this.data);
        
        this.modalChange.emit({
            title: "Shopping List",
            data: this.data
        });
    }
}