import { Component, AfterViewInit, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-logout',
    template: `
    <div class="modal-body">
        <div class="text-center" [ngSwitch]="name">
            <ng-container *ngSwitchCase="''">
                <p>You are logged out.</p>
            </ng-container>
            <ng-container *ngSwitchDefault>
                <div  class="pad-button">
                    <p>Are you sure you would like to logout, {{name}}?</p>
                    <button class="btn btn-outline-danger btn-block" (click)="signOut()">Sign out <i class="fa fa-sign-out" aria-hidden="true"></i></button>
                </div>
            </ng-container>
            <br />
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="toggle($event)">Close</button>
    </div>

    `,
    styleUrls: ['./content.component.css']
})

export class Logout {
    @Output() stateChange = new EventEmitter<any>();
    @Output() userChange = new EventEmitter<any>();

    @Input() name: string;

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    toggle(e){
        this.stateChange.emit('inactive');
    }

    signOut(){
        this.entryService.getUser(`${this.url}/auth/logout`)
        .then(user => {
            this.userChange.emit(user);
        });
    }
}