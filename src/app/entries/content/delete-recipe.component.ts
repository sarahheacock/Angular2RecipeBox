import { Component, AfterViewInit, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-recipe-delete',
    template: `
    <div class="modal-body">
        <div class="center text-center">
            <p>Are you sure you would like to delete, {{data.title}}?</p>
            <button class="btn btn-danger center" (click)="delete()">Delete Recipe <i class="fa fa-trash"></i></button>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})

export class DeleteRecipe {
    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();

    @Input() data: {
        title:string;
        category:string;
        _id:string;
    };

    @Input() _id: string;
    @Input() token: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    toggle(e){
        this.stateChange.emit('inactive');
    }

    delete(){
        //"/:userID/recipe/:recipeID"
        this.entryService.deleteUser(`${this.url}/user/${this._id}/recipe/${this.data._id}?token=${this.token}`)
        .then(user => {
            this.userChange.emit(user);
        });
    }
}