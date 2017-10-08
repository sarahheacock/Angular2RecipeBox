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
        User.findOne({userID: profile._json.id}).exec((err, user) => {
            if(err){
                console.log(err);
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

// clientID: '763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com',
// clientSecret: 'iHy7MLbSD6-8VWAkFzo0Q18c'

// passport.use(new GoogleTokenStrategy({
//     clientID: '763862879351-ut6n5jru27vvk2dr94u9jd4b71m1va7b.apps.googleusercontent.com',
//     clientSecret: 'iHy7MLbSD6-8VWAkFzo0Q18c'
//   }, (token, refreshToken, profile, next) => {
//     process.nextTick(() => {
//         console.log("BLAH", profile);
//         User.findOne({userID: profile._json.id}).exec((err, user) => {
//             if(err){
//                 return next(err);
//             }
//             else if(!user){
//                 const newUser = new User();

//                 newUser.name = profile._json.name;
//                 newUser.userID = profile._json.id;

//                 newUser.save((err, user) => {
//                     if(err){
//                         err = new Error("Unable to create profile.");
//                         err.status = 400;
//                         res.json({message: err.message});
//                     }
//                     next(null, user);
//                 });
//             }
//             else {
//                 next(null, user);
//             }
//         });
//     });
// }));

//========================================================
router.use(passport.initialize());

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

// router.get('/google/token', passport.authenticate('google-token'), (req, res) => {
//     if(req.user){
//         next();
//     }
//     else {
//         let err = new Error("User not found");
//         next(err);
//     }
// }, mid.outputUser);


// router.get('/logout', (req, res) => {
//   req.logout();
//   res.json({user: initialUser, message: "logged out"})
// });

module.exports = router;