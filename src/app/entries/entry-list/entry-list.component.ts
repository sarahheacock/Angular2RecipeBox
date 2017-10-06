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
        // this.entryService
        // .getEntries()
        // .then(entries => {
        //     console.log(entries);
        //     this.entries = entries;
        //     this.entryService.toggleState();
        // });

        this.entries = [{
            "category": "Drinks",
            "recipes": [
                {
                    "href": "http://orangette.net/2015/07/july-29/",
                    "pic": "http://orangette.net/wp-content/uploads/2015/09/b8bd1-_f7a60341-380x250.jpg",
                    "title": "Campari Granita",
                    "ingredients": [
                        " 1 cup (250 ml) freshly squeezed orange juice ",
                        " ½ cup (125 ml) Campari ",
                        " ½ teaspoon freshly squeezed lemon juice ",
                        " 1 cup (250 ml) freshly squeezed grapefruit juice ",
                        " ½ cup (125 ml) Campari ",
                        " 2 tablespoons (25 grams) superfine or caster sugar ",
                        " ½ teaspoon freshly squeezed lemon juice "
                    ],
                    "directions": [
                        "Stir the juice, Campari, and lemon juice (and sugar, if using grapefruit juice) together. Pour into an 8-inch square metal pan (or another pan of similar volume). Place in the freezer. Stir the mixture with a spoon every hour or so, to break it up into large ice crystals. I used a fork for the last stirring, to make the ice crystals finer and fluffier. It took about three hours for my granita to be fully frozen and to the right texture. If you forget to stir the mixture and it freezes solid, don’t panic: just break it into chunks and pulse briefly in the food processor. To serve, spoon the granita into chilled glasses."
                    ]
                },
                {
                    "href": "http://orangette.net/2011/02/by-popular-demand/",
                    "pic": "http://orangette.net/wp-content/uploads/2011/02/polaaperolcocktail-2-380x250.jpg",
                    "title": "Pamplemousse",
                    "ingredients": [
                        " ½ oz. Aperol ",
                        " 2 oz. freshly squeezed grapefruit juice, pulp strained out and discarded ",
                        " 2 oz. dry white wine "
                    ],
                    "directions": [
                        "Fill a tall glass about halfway with ice cubes. Add the Aperol, juice, and wine, and stir to blend. Strain into glass."
                    ]
                },
                {
                    "href": "http://orangette.net/2010/07/thats-the-spirit/",
                    "pic": "http://orangette.net/wp-content/uploads/2010/07/f84e0-pimmsalone1-380x250.jpg",
                    "title": "My Pimm’s Cup",
                    "ingredients": [
                        " 1 ½ ounces Pimm’s No. 1 ",
                        " 4 ½ ounces ginger ale or ginger beer ",
                        " Ice ",
                        " 1 thin slice cucumber ",
                        " 1 thin slice lemon, plus more for squeezing ",
                        " 1 slice strawberry ",
                        " A couple of mint leaves "
                    ],
                    "directions": [
                        "Combine the Pimm’s and ginger beer in a Collins glass, or something similar. Add ice until the liquid comes almost to the rim of the glass. Add the cucumber, lemon, and strawberry, plus a small squeeze of lemon juice, if you like. Use a straw to bash the fruit around a little bit. Add the mint, and serve immediately."
                    ]
                }
            ]
        },
        {
            "category": "Beverages",
            "recipes": [
                {
                    "href": "http://orangette.net/2015/02/et-voila/",
                    "pic": "http://orangette.net/wp-content/uploads/2015/09/bcf0d-_f7a47671-380x250.jpg",
                    "title": "Matthew's Hot Cocoa",
                    "ingredients": [
                        " 2 tablespoons natural cocoa powder ",
                        " 2 tablespoons sugar ",
                        " 8 ounces whole milk, heated to just bubbling on the stove or in the microwave "
                    ],
                    "directions": [
                        "Whisk together the cocoa powder and sugar in a mug, if serving one, or, if serving two, just do this in the measuring cup that you measured the milk in. Add a splash of the hot milk, and continue whisking until a thick paste forms. Continue adding milk and whisking until the cocoa is rich and well-blended. Serve immediately."
                    ]
                },
                {
                    "href": "http://orangette.net/2014/07/i-promised/",
                    "pic": "http://orangette.net/wp-content/uploads/2015/09/5d6b4-_f7a37001-380x250.jpg",
                    "title": "Sour Cherry Shake",
                    "ingredients": [
                        " 2 pounds (900 grams) fresh sour cherries, stemmed and pitted, or 24 ounces canned or jarred cherries, drained ",
                        " 1 quart vanilla ice cream "
                    ],
                    "directions": [
                        "Put the cherries in a blender or food processor, and blend to a smooth puree. Add the ice cream, and continue to blend until the mixture is smooth and pale pink. Pour into four glasses, and serve immediately."
                    ]
                }
            ]
        }];
    }

    // ngOnInit(){
    //     this.entryService
    //         .getEntries()
    //         .subscribe((entries:any) => {
    //             this.entries = entries
    //         });

    // }
}
