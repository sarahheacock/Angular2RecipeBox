import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

//declare var gapi: any;

@Component({
    selector: 'app-shopping-list',
    //template: `<div></div>`,
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./content.component.css']
})

export class ShoppingList implements OnInit{
    // message: boolean = true;
    list: boolean = true;

    ingredient: string = '';
    ingredients: Array<{name:string; selected:boolean;}>;
    phone: string = '';
    phones: Array<string>;
    send: string = '';
    titleList: Array<string>;

    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();
    @Output() modalChange = new EventEmitter<{title:string; data:any}>()

    @Input() ingredientList: Array<{name:string; selected:boolean;}>;
    @Input() title: Array<string>;
    @Input() phoneList: Array<string>;
    @Input() data: {
        shoppingList: Array<{name:string; selected:boolean;}>;
        shoppingListNames: Array<string>
    }

    @ViewChild('f') f: NgForm;

    //@ViewChild('commentForm') commentForm: NgForm;
    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";

    constructor() {}

    ngOnInit(){

        //make a copy so that we can discard changes if we want later
        this.ingredients = this.data.shoppingList.concat(this.ingredientList).reduce((a, b) => {
            let bName = b.name.trim();

            const valid = a.reduce((c, d) => {
                let dName = d.name.trim();
                if(dName === bName) return a.indexOf(d);
                else return c;
            }, -1);
    
            b.name = bName;
            if(valid < 0) a.push({...b});
    
            return a;
        }, []);

        this.titleList = this.data.shoppingListNames.concat(this.title).reduce((a, b) => {
            if(!a.includes(b)) a.push(b);
            return a;
        }, []);

        this.phones = this.phoneList.map((i) => { return i; });
        this.send = this.phoneList[0] || '';
        this.list = this.ingredients.length > 0;
        
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
                    shoppingListNames: this.titleList,
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
                    shoppingListNames: this.titleList,
                    phone: this.phones
                }
            });
        }
        else {
            this.stateChange.emit('inactive');
        }
    }

    clear(f: NgForm){
        this.modalChange.emit({
            title: "Clear List",
            data: null
        });
    }


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