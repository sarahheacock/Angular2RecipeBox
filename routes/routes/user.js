const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
const jwt = require('jsonwebtoken');


router.post('/gmail/token', (req, res, next) => {
    User.findOne({userID: req.body.userID}, (err, user) => {
        if(err){
            next(err);
        }
        else if(!user){
            let newUser = new User(req.body);
            newUser.save((err, thisUser) => {
                if(err) next(err);
                else res.json(thisUser);
            });
        }
        else{
            res.json(user);
        }
    });  
});

module.exports = router;