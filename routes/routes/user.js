const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
const Book = require('../models/api').Book;
const mid = require("../middleware/user");


//=========PARAMETERS===========================
router.param("userID", (req, res, next, id) => {
    User.findById(id, (err, user) => {
      if(err){
        next(err);
      } 
      else if(!user){
        let error = new Error("User not found.")
        next(err);
      }
      else{
        req.user = user;
        next();
      }
    });
});

router.param("recipeID", (req, res, next, id) => {
    req.recipe = req.user.recipes.id(id);
    if(!req.recipe){
        let err = new Error("Recipe not found");
        err.status = 404;
        next(err);
    }
    else {
        next();
    }
});


//============ROUTES===============================

//router.use(mid.auth);

//called after user signs in with gamil
router.get('/:userID', mid.auth, mid.outputUser);


//create new recipe
router.post('/:userID', mid.auth, mid.formatInput, (req, res, next) => {
    req.user.recipes.push(req.body);
    next();
}, mid.saveAndOutput);
  
//add to shopping list
router.post("/:userID/list", mid.auth, (req, res, next) => {
    req.user.shoppingListNames.push(req.body.shoppingListNames);
    req.user.shoppingList = req.body.shoppingList.concat(req.user.shoppingList).reduce((a, b) => {
        if(!a.includes(b)) a.push(b);
        return a;
    }, []);

    console.log(req.user);
    next();
}, mid.saveAndOutput);

//edit recipe
router.put("/:userID/:recipeID", mid.auth, mid.formatInput, (req, res, next) => {
    Object.assign(req.recipe, req.body);
    next();
}, mid.saveAndOutput);

//delete recipe
router.delete("/:userID/:recipeID", mid.auth, (req, res, next) => {
    req.recipe.remove((err) => {
        if(err) next(err);
        else next();
    })
}, mid.saveAndOutput);


// router.post("/:userID/:boxID/:recID", (req, res, next) => {
//     Book.findOne({}, (err, book) => {
//         if(err){
//             next(err);
//         }
//         else{
//             const recipe = book.box.id(req.params.boxID).recipes.id(req.params.recID);
//             if(!recipe){
//                 let err = new Error("Recipe not found");
//                 err.status = 404;
//                 next(err);
//             }
//             else{
                // req.user.shoppingList = recipe.ingredients.concat(req.user.shoppingList).reduce((a, b) => {
                //     if(!a.includes(b)) a.push(b);
                //     return a;
                // }, []);

//                 req.user.shoppingListNames.push(recipe.title);
//                 console.log("ROUTE RECIPE", recipe);
//                 next();
//             }           
//         }
//     });
// }, mid.saveAndOutput);
  

module.exports = router;