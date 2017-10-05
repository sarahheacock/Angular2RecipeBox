import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
//import { Entry } from '../shared/entry.model';

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
        // if(!localStorage.recipes){
        this.entryService
        .getEntries()
        .then(entries => {
            console.log(entries);
            this.entries = entries;
            this.entryService.toggleState();
            //localStorage.setItem('recipes', JSON.stringify(entries));
        });
        // }
        // else {
        //     this.entries = JSON.parse(localStorage.recipes);
        //     console.log(this.entries);
        // }
    }

    // ngOnInit(){
    //     this.entryService
    //         .getEntries()
    //         .subscribe((entries:any) => {
    //             this.entries = entries
    //         });

    // }
}
