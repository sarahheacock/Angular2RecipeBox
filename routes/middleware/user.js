const secret = require('config').superSecret;
const jwt = require('jsonwebtoken');
const required = ["title", "ingredients", "href"];


const cap = (string) => {
  return string.trim().split(' ').map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }).join(' ');
};

const arr = (string) => {
    return string.split("\n").filter((str) => {
      if(str !== "") return str;
    });
};


// verifies token after login
const auth = (req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) { // decode token
      jwt.verify(token, secret, (err, decoded) => { // verifies secret and checks exp
        const userID = req.user.userID;
        if (err) {
          //NEED TO CHANGE TO SEND SIGN IN FORM
          //res.json({message: "Session expired."})
          res.json({
            name: '',
            userID: '',
            shoppingList: [],
            shoppingListNames: [],
            recipes: [],
            _id: '',
            phone: ''
          });
        }
        else if(decoded.userID !== userID){
          let err = new Error("Unauthorized! Go away!");
          err.status = 401;
          next(err);
        }
        else { // if everything is good, save to request for use in other routes
          next();
        }
      });
    }
    else {
      let err = new Error("You need a token.");
      err.status = 401;
      next(err);
    }
};

const saveAndOutput = (req, res, next) => {
  req.user.save((err, newUser) => {
    if(err){
      next(err);
    } 
    else {
      outputUser(req, res, next);
    }
  });
};

const outputUser = (req, res, next) => {
    console.log("user", req.user);
    if(!req.user){
        let err = new Error("Unable to create token.");
        next(err);
    }
    else {
        const token = jwt.sign({userID: req.user.userID}, secret, {
            expiresIn: '3h' //expires in three hour
        });
        let obj = req.user;
        obj.userID = token;
        console.log("obj", obj);
        // req.user.userID = jwt.sign({userID: req.user.userID}, secret, {
        //     expiresIn: '3h' //expires in three hour
        // })
        res.json(obj);
    }
}

//format input
const formatInput = (req, res, next) => {
  // const valid = required.reduce((a, b) => {
  //   return a && req.body[b] !== '' && req.body[b] !== undefined;
  // }, true);

  // if(!valid){
  //   res.json({message: "*Fill out required fields"});
  // }
  // else{
    req.body.title = cap(req.body.title);

    req.body.ingredients = arr(req.body.ingredients);
    req.body.directions = arr(req.body.directions);

    next();
  // }
};
  

module.exports = {
    auth: auth,
    saveAndOutput: saveAndOutput,
    outputUser: outputUser,
    // check: check,
    formatInput: formatInput
}