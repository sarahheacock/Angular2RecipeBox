import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Entry } from '../shared/entry.model';
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
                maxWidth: '200px',
                height: '250px'
            })),
            state('active', style({
                maxWidth: '1200px'
            })),
            transition('* <=> *', animate('500ms ease-in-out'))
        ]),
        trigger('grow', [
            state('inactive', style({
                fontSize: '150%'
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
    original: string;
    added: string;

    constructor(){
        this.contentShown = 'inactive';
        this.cloud = "original";
        this.original = "original";
        this.added = "added";
    }

    changeState() {
        this.contentShown = (this.contentShown === 'inactive') ? 'active': 'inactive';
        const element = document.getElementById(this.entry.pic);
        const dist = $(element).offset().top;

        $('html, body').animate({
            scrollTop: dist
        }, 1000, "swing");
    }
}
