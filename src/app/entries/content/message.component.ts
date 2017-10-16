import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

//declare var gapi: any;

@Component({
    selector: 'app-text-shopping',
    //template: `<div></div>`,
    templateUrl: './ingredients.component.html',
    styleUrls: ['./content.component.css']
})

export class TextShopping {
    message: boolean = true;
    @Output() stateChange = new EventEmitter<string>();
    @Output() userChange = new EventEmitter<User>();

    @Input() ingredients: Array<{name:string; selected:boolean;}>;
    @Input() title: Array<string>;
    @Input() phone: string;
    @Input() userID: string;
    @Input() token: string;

    //@ViewChild('commentForm') commentForm: NgForm;
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private entryService: EntryService) {}


    onSubmit(f: NgForm) {
        const result = Object.keys(f.value).reduce((a, b) => {
            if(f.value[b] && b !== "phone"){
                a.push({
                    name: b,
                    selected: f.value[b]
                });
            } 
            return a;
        }, []);

        console.log(result);
        // const result = Object.keys(f.value).map((key) => {
        //     return {
        //         name: key,
        //         selected: f.value[key]
        //     };
        // });


        const url = `${this.url}/user/${this.userID}/message?token=${this.token}`;

        this.entryService.postUser(url, {
            shoppingListNames: this.title,
            shoppingList: result,
            phone: f.value["phone"]
        }).then(user => {
            this.stateChange.emit('inactive');
            //this.userChange(user);
        });
    }

    toggle(e){
        //if(e) e.preventDefault();
        this.stateChange.emit('inactive');
    }
}