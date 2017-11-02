import { Component, Input, AfterContentInit, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Recipe } from '../shared/entry.model';
import $ from "jquery";


@Component({
    selector: 'app-entry',
    templateUrl: 'entry.component.html',
    styleUrls: ['entry.component.css'],
    animations: [
        trigger('showContent', [
            state('inactive', style({
                height: '0px'
            })),
            state('active', style({
                height: '*'
            })),
            transition('* <=> *', animate('500ms ease-in-out'))
        ]),
        trigger('expand', [
            state('inactive', style({
                maxWidth: '300px'
            })),
            state('active', style({
                maxWidth: '1200px'
            })),
            transition('* <=> *', animate('500ms ease-in-out'))
        ]),
        trigger('grow', [
            state('inactive', style({
                fontSize: '120%'
            })),
            state('active', style({
                fontSize: '170%'
            })),
            transition('* <=> *', animate('500ms ease-in-out'))
        ]),
        trigger('button', [
            state('inactive', style({
                padding: '0px 5px 0px 5px'
            })),
            state('active', style({
                padding: '0px 35px 0px 35px',
            })),
            transition('* <=> *', animate('500ms ease-in-out'))
        ])           
    ]
})

export class EntryComponent implements AfterContentInit{
    @Output() entryEdit = new EventEmitter<{title:string; data:any;}>();
    @Input() entry: Recipe;
    @Input() userName: string;

    contentShown: string;
    cloud: string;
    edit: string;
    title: string;
    button: string;

    constructor(private entryService: EntryService){
        this.contentShown = 'inactive';
        this.cloud = '';
        this.edit = '';
        this.title = '';
        this.button = "Add Ingredients";
        //this.entry.pic = this.entry.pic.replace("http://", "https://");
    }


    ngAfterContentInit(){
        this.cloud = (this.entry.pic.includes("http:")) ? "original": "added";
        this.edit = (this.entry.href.includes("http")) ? "original": "added";
        this.title = (this.contentShown === 'inactive') ? `${this.entry.title.slice(0, 20)}...`: this.entry.title;
        this.button = (this.contentShown === 'inactive') ? "Add Ingredients": "Add ingredients to shopping list.";
    }

    getImage(str){
        return str.replace("http://", "https://");
    }

    maintain(){
        this.contentShown = 'active';
        this.title = this.entry.title;
        this.button = "Add ingredients to shopping list.";
    }

    changeState(e) {
        if(e) e.preventDefault();

        this.contentShown = (this.contentShown === 'inactive') ? 'active': 'inactive';
        this.title = (this.contentShown === 'inactive') ? `${this.entry.title.slice(0, 12)}...`: this.entry.title;
        this.button = (this.contentShown === 'inactive') ? "Add Ingredients": "Add ingredients to shopping list.";

        setTimeout(() => { 
            this.animationDone();
        }, 250);
    }

    launch(e){
        if(e) e.preventDefault();
        this.maintain();

        const ingredients = this.entry.ingredients.map((item) => {
            return {
                name: item,
                selected: true
            };
        });

        const obj = (!this.userName) ? 
        {
            title: "Sign In",
            data: null
        } : 
        {
            title: "Shopping List",
            data: {
                shoppingListNames: [this.entry.title],
                shoppingList: ingredients
            }
        };

        console.log(obj);

        this.entryEdit.emit(obj);
    }

    editRecipe(e) {
        if(e) e.preventDefault();
        this.maintain();

        const obj = (!this.userName) ? 
        {
            title: "Sign In",
            data: null
        } : 
        {
            title: "Edit Recipe",
            data: {
                title: this.entry.title,
                ingredients: this.entry.ingredients.join(", "),
                directions: this.entry.directions.join(", "),
                pic: this.entry.pic,
                href: this.entry.href,
                _id: this.entry._id
            }
        };

        this.entryEdit.emit(obj);
    }

    deleteRecipe(e){
        if(e) e.preventDefault();
        this.maintain();
        
        const obj = (!this.userName) ? 
        {
            title: "Sign In",
            data: null
        } : 
        {
            title: "Delete Recipe",
            data: {
                title: this.entry.title,
                category: this.entry.href,
                _id: this.entry._id
            }
        };

        this.entryEdit.emit(obj);
    }


    animationDone(){
        //console.log(this.entry);
        // const element = document.getElementById(this.entry._id);
        // const dist = $(element).offset().top;

        // $('html, body').animate({
        //     scrollTop: dist
        // }, 700, "swing");
    }
}
