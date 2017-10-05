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
    }
});

const BoxSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    recipes: { 
        type: [Schema.Types.ObjectId], 
        ref: 'Recipe', 
        required: true 
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

const Recipe = mongoose.model("Recipe", RecipeSchema);
const Box = mongoose.model("Box", BoxSchema);

module.exports = {
    Recipe: Recipe,
    Box: Box
}