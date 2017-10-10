import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { EntryService } from '../shared/entry.service';


@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./login.component.css']
})

export class Logout {
    name: string = '';
    subscription: any;

    constructor(private entryService: EntryService) {
        this.name = this.entryService.user.name;
    }

    ngOnInit() {
        this.subscription = this.entryService.getUser().subscribe(item => this.name=item.name);
    }

    signOut() {
        this.entryService.logoutUser();
    }
}