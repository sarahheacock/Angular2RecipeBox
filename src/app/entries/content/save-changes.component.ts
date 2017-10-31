import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { NgForm } from '@angular/forms';
import { User } from '../shared/entry.model';

@Component({
    selector: 'app-save-changes',
    templateUrl: './save-changes.component.html',
    styleUrls: ['./content.component.css']
})


export class SaveChanges {
    phones: Array<string>;
    newPhone: string;
    send: string;

    @Output() stateChange = new EventEmitter<string>();
    @Output() modalChange = new EventEmitter<{title:string; data:any}>();

    @Input() token: string;
    @Input() userID: string;
    @Input() userPhone: Array<string>;

    @Input() ingredients: {
        shoppingListNames: Array<string>;
        shoppingList: Array<{name:string; selected:boolean;}>;
    };

    private url = (window.location.hostname === "localhost") ? "http://localhost:8080" : "";
    constructor(private entryService: EntryService) {}

    ngOnInit(){
        this.phones = this.userPhone.map((i) => { return i; });
        this.send = this.userPhone[0] || '';
        this.newPhone = '';
    }

    addPhone(text: NgForm){
        console.log(text.value);
        const num = text.value.phone.trim();

        if(num && !this.phones.includes(num)){
            this.phones.splice(0, 0, num);

            //this.list = true;
            this.newPhone = '';
            this.send = num;
            console.log(this.phones);
        }
    }


    onSend(f: NgForm) {     
        let valid = true;

        if(valid){
            this.modalChange.emit({
                title: "Sending Text...",
                data: {
                    ...this.ingredients,
                    send: f.value.send,
                    phone: this.phones
                }
            });
        }
    }


    onSave(f: NgForm){
        console.log({
            ...this.ingredients,
            send: f.value.send,
            phone: this.phones
        });

        this.modalChange.emit({
            title: "Saving Changes...",
            data: {
                ...this.ingredients,
                phone: this.phones,
                send: undefined
            }
        });
    }


    toggle(e){
        console.log("toggle");
        this.stateChange.emit('inactive');
        //this.userChange.emit(this.user);
        // this.modalChange.emit({
        //     title: "Save Changes",
        //     data: {
        //         ...this.ingredients,
        //         phone: this.phones,
        //         send: this.send
        //     }
        // });
    }
}