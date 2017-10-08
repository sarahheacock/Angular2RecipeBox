const secret = require('config').superSecret;
const jwt = require('jsonwebtoken');


const arr = (string) => {
    return string.split("\n").filter((str) => {
      if(str !== "") return str;
    });
}


// verifies token after login
const auth = (req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) { // decode token
      jwt.verify(token, secret, (err, decoded) => { // verifies secret and checks exp
        const userID = req.user.userID || req.body.userID;
        if (err || decoded.userID !== userID) {
          //NEED TO CHANGE TO SEND SIGN IN FORM
          res.json({message: "Session expired."})
        }
        else { // if everything is good, save to request for use in other routes
          next();
        }
      });
    }
    else {
      let err = new Error("Auth error");
      err.status = 401;
      next(err);
    }
};


const outputUser = (req, res, next) => {
    if(!req.user){
        let err = new Error("Unable to create token.");
        next(err);
    }
    else {
        const obj = Object.assign(req.user, {userID: jwt.sign({userID: req.user.userID}, secret, {
            expiresIn: '3h' //expires in three hour
        })});
        // req.user.userID = jwt.sign({userID: req.user.userID}, secret, {
        //     expiresIn: '3h' //expires in three hour
        // })
        res.json(obj);
    }
}

//check input
const check = (req, res, next) => {
    const valid = required.reduce((a, b) => {
      return a && req.body[b] !== '' && req.body[b] !== undefined;
    }, true);
  
    if(valid){
      next();
    }
    else{
      res.json({message: "*Fill out required fields"});
    }
};

//format input
const formatInput = (req, res, next) => {
    req.body.title = cap(req.body.title);
  
    req.body.ingredients = arr(req.body.ingredients);
    req.body.directions = arr(req.body.directions);
  
    next();
};
  

module.exports = {
    auth: auth,
    outputUser: outputUser,
    check: check,
    formatInput: formatInput
}