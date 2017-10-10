const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
const mid = require("../middleware/user");

const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

//user id is used to retrieve user in deserializeUser
passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((obj, next) => {
    next(null, obj);
});


passport.use(new FacebookTokenStrategy({
    clientID: '1474280852691654',
    clientSecret: '4d1a3df5a7f659182e213143fcec834e'
  }, (token, refreshToken, profile, next) => {
    process.nextTick(() => {
        //console.log("PROFILE", profile);
        User.findOrCreate(profile._json, (err, user) => {
            if(err) next(err);
            else next(null, user);
        });
    });
}));


passport.use(new GoogleTokenStrategy({
    clientID: '763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com',
    clientSecret: 'iHy7MLbSD6-8VWAkFzo0Q18c'
  }, (token, refreshToken, profile, next) => {
    process.nextTick(() => {
        //console.log("PROFILE", profile);
        User.findOrCreate(profile._json, (err, user) => {
            if(err) next(err);
            else next(null, user);
        });
    });
}));

const create = () => {

}

//========================================================
router.use(passport.initialize());

router.get('/logout', (req, res) => {
    req.logout();
    const temp = new User();
    res.json(Object.assign(temp, {_id: ''}));
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res, next) => {
    //console.log(req.user);
    if(req.user){
        next();
    }
    else {
        let err = new Error("User not found");
        next(err);
    }
}, mid.outputUser);

router.get('/google/token', passport.authenticate('google-token'), (req, res, next) => {
    if(req.user){
        next();
    }
    else {
        let err = new Error("User not found");
        next(err);
    }
}, mid.outputUser);


module.exports = router;