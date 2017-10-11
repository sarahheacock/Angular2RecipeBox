import { Component, OnInit, AfterContentInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
//import { Entry } from '../shared/entry.model';

//declare var auth2: any;
//declare var signInCallback: any;

@Component({
    selector: 'app-entry-list',
    templateUrl: 'entry-list.component.html',
    styleUrls: ['entry-list.component.css']
})

export class EntryListComponent implements OnInit {
    entries: any;
    //keys: any[];

    constructor(private entryService: EntryService){
        console.log(this.entries);
    }   

    ngOnInit(){
        this.entryService
        .getEntries()
        .then(entries => {
            console.log(entries);
            this.entries = entries;
            this.entryService.toggleState();
        });
    }

    // ngAfterContentInit(){
    //     this.entryService
    //     .getUserEntries()
    //     .then(entries => {

    //     });
    // }
}
