import { Component, Input, AfterContentInit, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
//import { Entry } from '../shared/entry.model';
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
                maxWidth: '270px'
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

export class EntryComponent {
    @Input() entry: any;
    contentShown: string;
    cloud: string;
    title: string;
    button: string;

    // name: string = '';
    // subscription: any;
    // original: string;
    // added: string;

    constructor(private entryService: EntryService){
        this.contentShown = 'inactive';
        this.cloud = '';
        this.title = '';
        this.button = "Add Ingredients";

        // this.name = this.entryService.user.name;
    }


    // ngOnInit() {
    //     this.subscription = this.entryService.getUser().subscribe(item => this.name=item.name);
    // }

    ngAfterContentInit(){
        this.cloud = (this.entry.pic.includes("http:")) ? "original": "added";
        this.title = (this.contentShown === 'inactive') ? `${this.entry.title.slice(0, 12)}...`: this.entry.title;
        this.button = (this.contentShown === 'inactive') ? "Add Ingredients": "Add ingredients to shopping list.";
    }

    changeState(e) {
        if(e) e.preventDefault();

        this.contentShown = (this.contentShown === 'inactive') ? 'active': 'inactive';
        this.title = (this.contentShown === 'inactive') ? `${this.entry.title.slice(0, 12)}...`: this.entry.title;
        this.button = (this.contentShown === 'inactive') ? "Add Ingredients": "Add ingredients to shopping list.";

        const element = document.getElementById(this.entry._id);
        const dist = $(element).offset().top;

        $('html, body').animate({
            scrollTop: dist
        }, 1000, "swing");
    }

    launch(e){
        if(e) e.preventDefault();
        this.entryService.changeContent({
            title: "Add Ingredients",
            data: this.entry.ingredients
        });
    }
}
