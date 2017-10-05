const express = require('express');
const fs = require('fs');
const router = express.Router();
const request = require("request");
const cheerio = require('cheerio');

//const util = require('util');
//var Promise = require('promise');

const Box = require("../models/api").Box;
const Recipe = require("../models/api").Recipe;

const required = ["title"];

const cap = (string) => {
  return string.trim().split(' ').map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }).join(' ');
};

const arr = (string) => {
  return string.split("\n").filter((str) => {
    if(str !== "") return str;
  });
}

//=========PARAMETERS===========================
router.param("category", (req, res, next, id) => {
  const cat = cap(id);

  Box.findOne({category: cat}, (err, box) => {
    if(err){
      next(err);
    } 
    else if(!box){
      req.box = new Box({
        category: cat,
        recipes: []
      });
      next();
    }
    else{
      req.box = box;
      next();
    }
  });
});

//=========MIDDLEWARE===========================
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

//format output
const output = (req, res, next) => {
  Box.find({}).populate({
    path: 'recipes',
    model: 'Recipe'
  }).exec((err, doc) => {
    const arr = (req.recipes) ? doc.concat(req.recipes) : doc;

    const result = arr.sort((a, b) => {
      return (b.category < a.category) ? 1 : -1;
    });

    res.json({
      data: result
    });
  });
};

//============ROUTES===============================
//get all recipes and boxes
router.get('/', output);


router.get('/scrape', (req, res, next) => {
  fs.readFile("output.json", (err, data) => {
    if(err) next();
    else res.json(JSON.parse(data));
  });
}, (req, res, next) => {
  const url = "http://orangette.net/recipes/";

  request(url, (err, response, html) => {
    if(err) next(err);
    const $ = cheerio.load(html);

    let result = [];
    
    const div = $("option");
    const length = div.length;

    div.each(function(){
      const value = $(this).val();
      if(value.includes("course")) result.push(value);
    });

    req.links = result;
    req.final = result.map((link) => {
      const cat = link.split('/').reduce((a, b) => {
        if(b !== "") return b;
        else return a;
      }, "");

      return {
        category: cap(cat),
        recipes: []
      };
    });
    next();
  });

}, (req, res, next) => {

  //const linkLength = req.links.length;
  const getMore = (obj) => {
    request(obj.href, (err, response, html) => {
      if(err) next(err);
      const $ = cheerio.load(html, {
        xml: {
          normalizeWhitespace: true,
        }
      }); 
      
      obj.ingredients = $('div.ingredient').map(function() {
        return $(this).text();
      }).get();

      obj.directions = $('div[itemprop="instructions"] p').map(function() {
        return $(this).text();
      }).get();

      return obj;
    });
  }

  const func = (i, result) => {
    console.log(result);
    const link = req.links[i];

    request(link, (err, response, html) => {
      if(err) next(err);
      const $ = cheerio.load(html, {
        xml: {
          normalizeWhitespace: true,
        }
      }); 

      result[i]["recipes"] = $("main.content-left ul.grid-list li a").map(function(j){
        let obj = {};

        obj.href = $(this).attr('href');
        obj.pic = $(this).children().first().attr('src');
        obj.title = $(this).find("h3").text();


        if(Object.keys(obj).length === 3 && obj.href){
          getMore(obj);
          return obj;
        }
      }).get();
 
      if(i === req.final.length - 1 && result[i]["recipes"].length > 0){
        const last = result[i]["recipes"];

        const myFunc = () => {
          const done = Array.isArray(last[last.length - 1]["directions"]);
          if(!done){
            setTimeout(myFunc, 1500);
          } 
          else{
            fs.writeFile('output.json', JSON.stringify({
              createdAt: new Date(),
              data: result
            }, null, 4), function(err){
              if(err){
                next(err);
              }
              else {
                console.log('File successfully written! - Check your project directory for the output.json file');
                res.send({data: result});
              }
            });
          } 
        }

        myFunc();
      } 
      else if(result[i]["recipes"].length > 0){
        func(i + 1, result);
      }
    });
  };

  func(0, req.final);

});


//create new recipe
router.post('/:category', check, formatInput, (req, res, next) => {
  let recipe = new Recipe(req.body);
  recipe.save((err, newRecipe) => {
    if(err){
      next(err);
    }
    else{
      console.log(req.box);
      req.box.recipes.push(recipe);
      req.box.save((err, doc) => {
        if(err){
          next(err);
        } 
        else{
          res.status(201);
          res.json({
            data: [doc]
          });
        } 
      });
    }
  }); 
});

//edit recipe
router.put("/:category/:id", check, formatInput, (req, res, next) => {
  next();
});

//delete recipe
router.delete("/:category/:id", check, formatInput, (req, res, next) => {
  next();
});

module.exports = router;

