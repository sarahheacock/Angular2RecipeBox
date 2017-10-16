// export class Entry {
//   title: string;
//   category: string;
//   ingredients: any[];
//   instructions: string;
//   pic: string;
// }

export class Recipe {
  title: string;
  _id: string;
  ingredients: Array<string>;
  directions: Array<string>;
  pic: string;
  href: string;
}

export class User {
  _id: string;
  recipes: Array<Recipe>;
  shoppingList: Array<{
    name:string;
    selected:boolean;
  }>;
  shoppingListNames: Array<string>;
  name: string;
  userID: string;
  phone: string;
}
