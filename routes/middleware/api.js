const Book = require("../models/api").Book;

const request = require("request");
const cheerio = require('cheerio');

const cap = (string) => {
    return string.trim().split(' ').map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }).join(' ');
};

const cat = (link) => {
    const str = link.split('/').reduce((a, b) => {
        if(b !== "") return b;
        else return a;
    }, "");

    return cap(str);
}

const init = (req, res, next) => {
    Book.findOne({}).exec((err, doc) => {
        if(err){
            next(err);
        }
        else if(doc){
            const date = Date.now() - 14*24*60*60*1000; //update every two weeks
            if(doc.createdAt < new Date(date)){
                req.book = doc;
                req.categories = doc.box.map((b) => b.category);
                updateBox(req, res, next);
            }
            else {
                req.book = doc;
                next();
            }
        }
        else{
            getBoxes(req, res, next);
        }
    })
};

const updateBox = (req, res, next) => {
    const url = 'http://orangette.net/';
    request(url, (err, response, html) => {
        if(err) next(err);
        const $ = cheerio.load(html, {
            xml: {
              normalizeWhitespace: true,
            }
        }); 

        //find an article that is newer than the created at date
        const div = $('article.post--single');
        let recipes = [];

        div.each(function(){
            const time = $(this).find('time').text();
            if(req.book.createdAt < new Date(time)){
                console.log("OOPS");
                let obj = {};
                obj.pic = $(this).find('img').attr('src');
                obj.title = $(this).find('h2.title').text();
                obj.href = $(this).find('div.tag-list a').attr('href');
                obj.ingredients = $(this).find('div.ingredient').map(function() {
                    return $(this).text().replace(/\n/g, '').trim();
                  }).get();
                obj.directions = $(this).find('div[itemprop="instructions"] p').map(function() {
                    return $(this).text();
                }).get();

                let tags = [];
                $(this).find('div.tag-list a').each(function(){
                    const href = $(this).attr('href');

                    if(href.includes('course')){
                        let text = $(this).text();
                        const category = cap(text);
    
                        if(req.categories.includes(category)){
                            tags.push(category);
                        }
                        else {
                            req.book.box.push({
                                category: category,
                                recipes: []
                            });
                        }
                    } 
                });

                if(tags.length === 0) tags.push("Main Dish");
                console.log(tags);

                req.book.box.forEach((b) => {
                    if(tags.includes(b.category)){
                        console.log(b.category);
                        b.recipes.push(obj);
                    }
                });
                
                //console.log(new Date(time) < req.book.createdAt, obj, "TAGS", tags);
            }
        });
        
        req.book.save((err, doc) => {
            if(err) next(err);
            else next();
        });
    })
}

const getBoxes = (req, res, next) => {
    const url = "http://orangette.net/recipes/";
  
    request(url, (err, response, html) => {
      if(err) next(err);
      const $ = cheerio.load(html);
  
      req.links = [];
      req.final = [];
      
      const div = $("option");
  
      div.each(function(){
        const href = $(this).val();
        
        if(href.includes('course')){
            let text = $(this).text();
            const category = cap(text);

            req.final.push({
                category: category,
                recipes: []
            });
            req.links.push(href);
        } 
      });
      
  
    //   req.links = links;
    //   req.final = result;
      getRecipes(req, res, next);
    }); 
};

const getRecipes = (req, res, next) => {
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
            else{ //DONE!
                let book = new Book({
                    box: result
                });
                
                book.save((err, doc) => {
                    if(err){
                        next(err);
                    } 
                    else {
                        req.book = doc;
                        next();
                    }
                })
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
}

  

module.exports = {
    init: init
}