import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-save-changes',
    template: `
    <div class="modal-body">
        <div class="pad-button">
            <p class="text-center">Would you like to save changes?</p>
            <button class="btn btn-outline-primary btn-block" (click)="save($event)">Save Changes</button>
        </div>
        <br />
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})


export class SaveChanges {
    @Output() userChange = new EventEmitter<User>();
    @Input() user: User;
    @Input() ingredients: {
        phone: Array<string>;
        shoppingList: Array<{name:string; selected:boolean;}>;
    };

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    save(e){
        console.log("clear");
        const url = `${this.url}/user/${this.user._id}/list?token=${this.user.userID}`;
        
        this.entryService.putUser(url, this.ingredients).then(user => {
            this.userChange.emit(user);
        });
    }

    toggle(e){
        console.log(this.user);
        this.userChange.emit(this.user);
    }
}