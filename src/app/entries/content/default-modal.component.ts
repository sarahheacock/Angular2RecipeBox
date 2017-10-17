import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-default',
    template: `
    <div class="text-center modal-body">
        <i class="fa fa-spinner fa-spin fa-2x"></i>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" name="inactive" (click)="toggle($event)">Close</button>
    </div>
    `,
    styleUrls: ['./content.component.css']
})

export class DefaultModal{
    @Output() stateChange = new EventEmitter<any>();
    
    constructor(){}

    toggle(e){
        this.stateChange.emit('inactive');
    }
}
