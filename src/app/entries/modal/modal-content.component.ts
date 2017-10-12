import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntryService } from '../shared/entry.service';


@Component({
  selector: 'app-modal-content',
  templateUrl: 'modal-content.component.html',
  styleUrls: ['modal-content.component.css'],
})

export class ContentModal {
  show: boolean = true;
  hide: any[] = ["Loading", "Logout", "Sign In"];
  content: string;

  data: any;
  recipe: string;
  phone: string;
  subscription: any;
  
  constructor(private entryService: EntryService) {
    const modal = this.entryService.modalContent;
    this.format(modal);
  }

  ngOnInit() {
    this.subscription = this.entryService.getContent().subscribe(item => {
      this.format(item)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  format(item) {
    this.content = item.title;
    this.show = !this.hide.includes(item.title);

    if(item.title === "Add Ingredients" || item.title === "Text Shopping List"){
      const ingredients = item.data.ingredients.reduce((a, b) => {
        if(!a.includes(b.trim())) a.push(b.trim());
        return a;
      }, []);

      this.data = ingredients.map((b) => {
        return {
          name: b,
          selected: true
        };
      });
      this.phone = (item.title === "Text Shopping List") ? item.data.phone : '';
      this.recipe = item.data.title;

    }
    else {
      this.data = item.data;
      this.recipe = '';
    }

    console.log(this.data);
  }

  stateChange() {
    this.entryService.toggleState();
  }

  onIngredientsAdded() {

  }
}