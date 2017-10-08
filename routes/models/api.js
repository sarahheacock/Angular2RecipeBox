const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    ingredients: {
        type: Array,
        default: []
    },
    directions: {
        type: Array,
        default: []
    },
    pic: {
        type: String,
        default: "Tile-Dark-Grey-Smaller-White-97_pxf5ux"
    },
    href: { // href is either the recipe url or category
        type: String,
        required: true
    }
});

const BoxSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    recipes: { 
        type: [RecipeSchema], 
        default: []
    }
});

BoxSchema.pre('save', function(next){
    let box = this;
    if(!box.recipes){
        box.recipes = [];
    }
    else {
        box.recipes.sort((a, b) => {
            return (a.title < b.title) ? -1 : 1;
        });
    }  
    
    next();
});

const BookSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    box: {
        type: [BoxSchema],
        default: []
    }
});


BookSchema.pre('save', function(next){
    let book = this;
    if(!book.box){
        book.box = [];
    }
    else {
        book.box.sort((a, b) => {
            return (a.category < b.category) ? -1 : 1;
        });
    } 
    
    book.createdAt = new Date();  
    next();
});

UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    recipes: {
        type: [RecipeSchema],
        default: []
    },
    shoppingList: {
        type: Array,
        default: []
    }
})

const User = mongoose.model("User", UserSchema);
const Book = mongoose.model("Book", BookSchema);
//const Box = mongoose.model("Box", BoxSchema);

module.exports = {
    User: User,
    Book: Book,
    //Box: Box
}