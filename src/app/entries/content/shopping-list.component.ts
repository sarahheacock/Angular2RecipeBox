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
    titleList: Array<string>;

    @Output() stateChange = new EventEmitter<any>();
    @Output() modalChange = new EventEmitter<{title:string; data:any}>()

    @Input() ingredientList: Array<{name:string; selected:boolean;}>;
    @Input() title: Array<string>;
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

        this.list = this.ingredients.length > 0;
        
        console.log(this.ingredientList, this.ingredients);
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


    clear(f: NgForm){
        this.modalChange.emit({
            title: "Clear List",
            data: null
        });
    }    

    continue(f: NgForm){
        //if(e) e.preventDefault();
        console.log(this.ingredientList, this.ingredients);
        this.modalChange.emit({
            title: "Save Changes",
            data: {
                shoppingListNames: this.titleList,
                shoppingList: this.modify(f.value)
            }
        });
    }

    toggle(e){
        this.stateChange.emit('inactive');
    }


    modify(value){
        return Object.keys(value).reduce((a, b) => {
            a.push({
                name: b.trim(),
                selected: value[b]
            });
            return a;
        }, []);
    }
}