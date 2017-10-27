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
                maxWidth: '280px'
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
        ])        
    ]
})

export class EntryComponent implements AfterContentInit{
    @Output() entryEdit = new EventEmitter<{title:string; data:any;//{
        // title:string;
        // ingredients:Array<{
        //     name:string;
        //     selected:boolean;
        // }>;
    //}
    }>();
    @Input() entry: Recipe;
    @Input() userName: string;

    contentShown: string;
    cloud: string;
    title: string;
    button: string;

    constructor(private entryService: EntryService){
        this.contentShown = 'inactive';
        this.cloud = '';
        this.title = '';
        this.button = "Add Ingredients";
        //this.entry.pic = this.entry.pic.replace("http://", "https://");
    }


    ngAfterContentInit(){
        this.cloud = (this.entry.pic.includes("http:")) ? "original": "added";
        this.title = (this.contentShown === 'inactive') ? `${this.entry.title.slice(0, 12)}...`: this.entry.title;
        this.button = (this.contentShown === 'inactive') ? "Add Ingredients": "Add ingredients to shopping list.";
    }

    getImage(str){
        return str.replace("http://", "https://");
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
            title: "Add Ingredients",
            data: {
                title: this.entry.title,
                ingredients: ingredients
            }
        };

        this.entryEdit.emit(obj);
    }

    editRecipe(e) {
        if(e) e.preventDefault();
        
        // const ingredients = this.entry.ingredients.map((item) => {
        //     return {
        //         name: item,
        //         selected: true
        //     };
        // });

        const obj = (!this.userName) ? 
        {
            title: "Sign In",
            data: null
        } : 
        {
            title: "Edit Recipe",
            data: {
                title: '',
                ingredients: '',
                directions: '',
                pic: 'Tile-Dark-Grey-Smaller-White-97_pxf5ux',
                href: ''
            }
        };

        this.entryEdit.emit(obj);
    }

    animationDone(){
        //console.log(this.entry);
        const element = document.getElementById(this.entry._id);
        const dist = $(element).offset().top;

        $('html, body').animate({
            scrollTop: dist
        }, 700, "swing");
    }
}
