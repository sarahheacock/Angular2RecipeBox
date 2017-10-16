const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
const Book = require('../models/api').Book;
const mid = require("../middleware/user");

const config = require('config');

const Twilio = require('twilio');
const textClient = new Twilio(
  config.accountSID,
  config.authToken
);

const formatNum = (num) => {
    const newNum = num.replace(/[^0-9]/gi, '');
    if(newNum.length === 11){
      return "+" + newNum;
    }
    else if(newNum.length === 10){
      return "+1" + newNum;
    }
    else {
      return newNum;
    }
};
  
const checkPhone = (newNum) => {
    //make sure num has <= 11 digits but >= 10 digits
    //newNum.replace("+", "");
    return /^[+]{1}([0-9]{10}|(1|0)[0-9]{10})$/.test(newNum);
};

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
//called after user signs in with gamil
router.get('/:userID', mid.auth, mid.outputUser);
  
//add to shopping list
router.post("/:userID/list", mid.auth, (req, res, next) => {
    req.user.shoppingListNames.push(req.body.shoppingListNames);
    req.user.shoppingListNames = req.user.shoppingListNames.reduce((a, b) => {
        if(!a.includes(b)) a.push(b);
        return a;
    }, []);

    req.user.shoppingList = req.user.shoppingList.concat(req.body.shoppingList).reduce((a, b) => {
        const valid = a.reduce((c, d) => {
            if(d.name === b.name) return a.indexOf(d);
            else return c;
        }, -1);

        if(valid > -1) a[valid]["selected"] = b["selected"];
        else a.push(b);

        return a;
    }, []);

    console.log(req.user);
    next();
}, mid.saveAndOutput);

//clear shopping list 
router.put("/:userID/list", mid.auth, (req, res, next) => {
    req.user.shoppingList = [];
    req.user.shoppingListNames = [];
    next();
}, mid.saveAndOutput);

//text shopping list
router.post("/:userID/message", mid.auth, (req, res, next) => {
    const phone = formatNum(req.body.phone);
    req.user.phone = phone;
    next();
}, (req, res, next) => {
    const names = req.body.shoppingListNames;

    let i = 1;
    const list = req.body.shoppingList.reduce((a, b) => {      
        if(b.selected){
            a.push((i + 1) + ".\t" + b.name);
            i++;
        } 
        return a;
    }, []).join("\n");
    console.log(req.body.shoppingList, list);

    const content = "Hello, " + req.user.name + "!\n\n" + "Your Shopping List For:\n" + names + "\n\n" + list;

    textClient.messages.create({
        from: config.phone,
        to: req.user.phone,
        body: content
    }, (error, message) => {
        if(error) res.json({message: error.message});
        else next();
    });
}, mid.saveAndOutput);

//create new recipe
router.post('/:userID/recipe', mid.auth, mid.formatInput, (req, res, next) => {
    req.user.recipes.push(req.body);
    next();
}, mid.saveAndOutput);

//edit recipe
router.put("/:userID/recipe/:recipeID", mid.auth, mid.formatInput, (req, res, next) => {
    Object.assign(req.recipe, req.body);
    next();
}, mid.saveAndOutput);

//delete recipe
router.delete("/:userID/recipe/:recipeID", mid.auth, (req, res, next) => {
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