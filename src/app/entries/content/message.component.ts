import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
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

export class TextShopping implements OnInit{
    message: boolean = true;
    list: boolean = true;

    ingredient: string = '';
    ingredients: Array<{name:string; selected:boolean;}>;
    phone: string = '';
    phones: Array<string>;
    send: string = '';

    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();
    @Output() modalChange = new EventEmitter<{title:string; data:any}>()

    @Input() ingredientList: Array<{name:string; selected:boolean;}>;
    @Input() title: Array<string>;
    @Input() phoneList: Array<string>;
    @Input() userID: string;
    @Input() token: string;

    @ViewChild('f') f: NgForm;

    //@ViewChild('commentForm') commentForm: NgForm;
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor(private entryService: EntryService) {}

    ngOnInit(){
        this.list = this.ingredientList.length > 0;

        this.ingredients = this.ingredientList.map((i) => { return {...i}; }); //make a copy so that we can discard changes if we want later
        this.phones = this.phoneList.map((i) => { return i; });
        this.send = this.phoneList[0] || '';
        // this.send = (this.phoneList.length > 0) ? this.phoneList.reduce((a, b) => {

        // }, this.phones[0]["number"]);

        console.log(this.ingredientList, this.ingredients);
    }

    onSubmit(f: NgForm) {     
        const result = this.modify(f);
        console.log(result);

        let valid = true;

        if(valid){
            this.modalChange.emit({
                title: "Sending Text...",
                data: {
                    shoppingList: this.modify(f.value),
                    send: f.value.send
                }
            });
        }
    }

    addIngredient(add: NgForm){
        console.log(add.value);
        const ingredient = add.value.ingredient.trim();

        if(ingredient){
            this.ingredients = [{
                name: `${ingredient.slice(0, 1).toUpperCase()}${ingredient.slice(1)}`,
                selected: true
            }].concat(this.ingredients);

            this.list = true;
            this.ingredient = '';
        }
    }

    addPhone(text: NgForm){
        console.log(text.value);
        const num = text.value.phone.trim();

        if(num && !this.phones.includes(num)){
            this.phones.splice(0, 0, num);

            //this.list = true;
            this.phone = '';
            this.send = num;
            console.log(this.phones);
        }
    }

    toggle(f: NgForm){
        //if(e) e.preventDefault();
        console.log(this.ingredientList, this.ingredients);
        if(this.list){
            this.modalChange.emit({
                title: "Save Changes",
                data: {
                    shoppingList: this.modify(f.value),
                    phone: this.phones
                }
            });
        }
        else {
            this.stateChange.emit('inactive');
        }
    }

    clear(f: NgForm){
        // const result = this.modify(f);
        // console.log(f.value);
        this.modalChange.emit({
            title: "Clear List",
            data: null
        });
    }

    // save(f: NgForm){
    //     const result = this.modify(f);
    //     console.log(result);
    // }

    modify(value){
        return Object.keys(value).reduce((a, b) => {
            if(b !== "send"){
                a.push({
                    name: b.trim(),
                    selected: value[b]
                });
            }
            return a;
        }, []);
    }
}