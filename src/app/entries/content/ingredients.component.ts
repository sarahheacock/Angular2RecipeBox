import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';
//declare var gapi: any;

@Component({
    selector: 'app-add-shopping',
    templateUrl: './ingredients.component.html',
    styleUrls: ['./content.component.css']
})

export class AddShopping {
    message: boolean = false;
    list: boolean = true;
    
    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();

    @Input() ingredients: Array<{name:string; selected:boolean;}>;
    @Input() title: string;
    @Input() userID: string;
    @Input() token: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private entryService: EntryService) {}

    onSubmit(f: NgForm) {
        //console.log(f.value);
        const result = Object.keys(f.value).map((key) => {
            return {
                name: key,
                selected: f.value[key]
            };
        });

        console.log(result);

        const obj = {
            shoppingListNames: this.title,
            shoppingList: result
        };

        const url = `${this.url}/user/${this.userID}/list?token=${this.token}`;
        console.log(url, obj);

        this.entryService.postUser(url, obj)
        .then(user => {
            this.userChange.emit(user);
        });
    }

    toggle(e){
        //if(e) e.preventDefault();
        this.stateChange.emit('inactive');
    }
}