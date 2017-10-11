import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { EntryService } from '../shared/entry.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class Login {
    name: string = '';
    subscription: any;

    constructor(private entryService: EntryService) {
        this.name = this.entryService.user.name;
    }

    ngOnInit() {
        this.subscription = this.entryService.getUser().subscribe(item => this.name=item.name);
    }

    login(str) {
        if(str === 'google') this.entryService.loginWithGmail();
        else this.entryService.loginWithFacebook();
    }
}