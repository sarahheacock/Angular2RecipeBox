const express = require('express');
const router = express.Router();

const User = require('../models/api').User;
const jwt = require('jsonwebtoken');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

//user id is used to retrieve user in deserializeUser
passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((obj, next) => {
    next(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: '1474280852691654',
    clientSecret: '4d1a3df5a7f659182e213143fcec834e',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName'],
  }, (token, refreshToken, profile, next) => {
    process.nextTick(() => {
      User.findOne({userID: profile._json.id}).exec((err, user) => {
        if(err){
          return next(err);
        }
        else if(!user){
          const newUser = new User();

          newUser.name = profile._json.name;
          newUser.userID = profile._json.id;

          newUser.save((err, user) => {
            if(err){
              err = new Error("Unable to create profile.");
              err.status = 400;
              res.json({message: err.message});
            }
            next(null, user);
          });
        }
        else {
          next(null, user);
        }
      });
    });
}));

//========================================================
router.use(passport.initialize());

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', 
    { 
        failureRedirect: 'http://localhost:4200/'
    }), (req, res) => {
        const token = jwt.sign({userID: req.user.userID}, 'I want this to work!', {
            expiresIn: '3h' //expires in three hour
        });
        res.redirect('http://localhost:4200/?token=' + token + 'userName' + req.user.name);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({user: initialUser, message: "logged out"})
});

module.exports = router;