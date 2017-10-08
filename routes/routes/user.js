const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
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

//============ROUTES===============================

//router.use(mid.auth);

//called after user signs in with gamil
router.post('/', (req, res, next) => {
    User.findOne({userID: req.body.userID}, (err, user) => {
        if(err){
            next(err);
        }
        else if(!user){
            let newUser = new User(req.body);
            newUser.save((err, thisUser) => {
                if(err){
                    next(err);
                } 
                else {
                    req.user = thisUser;
                    next();
                } 
            });
        }
        else {
            req.user = user;
            next();
        }
    });  
}, mid.outputUser);


//create new recipe
router.post('/:userID', mid.check, mid.formatInput, (req, res, next) => {
    next();
});
  
  
//edit recipe
router.put("/:userID/:recipeID", mid.check, mid.formatInput, (req, res, next) => {
    next();
});

//delete recipe
router.delete("/:userID/:recipeID", mid.check, mid.formatInput, (req, res, next) => {
    next();
});

//add to shopping list
router.post("/:userID/:recipeID", (req, res, next) => {
    next();
});
  

module.exports = router;