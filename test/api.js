//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Box = require('../server/models/api').Box;
const Recipe = require('../server/models/api').Recipe;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Recipe', () => {
    before((done) => {
        Box.remove({}, (err) => {
            Recipe.remove({}, (err) => {
                console.log("RECIPE BOX DELETED BEGIN");
                done();
            });
        });
    });

    describe('set up db', () => {
        let recipeOne;
        let recipeTwo;
        let recipeThree;
        let boxOne;
        let boxTwo;

        beforeEach((done) => {
            recipeOne = new Recipe({
                title: "Soup",
                ingredients: ["peas", "carrots"],
                directions: ["simmer"]
            });

            recipeTwo = new Recipe({
                title: "Pie",
                ingredients: ["apples"],
                directions: ["bake"]
            });

            recipeThree = new Recipe({
                title: "Cake",
                ingredients: ["sugar", "flour"],
                directions: ["eat it"]
            });

            boxOne = new Box({
                category: "Soups",
                recipes: []
            });

            boxTwo = new Box({
                category: "Desserts",
                recipes: []
            });

            recipeOne.save((err, recOne) => {
                recipeTwo.save((err, recTwo) => {
                    recipeThree.save((err, recThree) => {
                        boxOne.recipes.push(recOne._id);
                        boxOne.save((err, bOne) => {
                            boxTwo.recipes.push(recTwo._id);
                            boxTwo.recipes.push(recThree._id);
                            boxTwo.save((err, bTwo) => {
                                console.log("DB CREATED");
                                done();
                            });
                        });
                    });
                });
            });
        });

        afterEach((done) => {
            Box.remove({}, (err) => {
                Recipe.remove({}, (err) => {
                    console.log("RECIPE BOX DELETED");
                    done();
                });
            });
        });

        describe('/GET recipe box', () => {
            it('should get all recipe boxes in alphabetical order', (done) => {
                chai.request(server)
                .get("/api")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array').length(2);

                    res.body.data[1]["recipes"].should.be.a('array').length(1);
                    res.body.data[0]["recipes"].should.be.a('array').length(2);

                    res.body.data[0]["recipes"][0]["title"].should.eql("Cake");
                    done();
                });
            });
        });

        describe('/POST add recipe', () => {
            it('should post new recipe to old box', (done) => {
                chai.request(server)
                .post("/api/soups")
                .send({
                    title: "pea",
                    ingredients: "broth\npeas",
                    directions: "boil"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array').length(2);

                    res.body.data[1]["recipes"].should.be.a('array').length(2);
                    res.body.data[0]["recipes"].should.be.a('array').length(2);

                    res.body.data[1]["recipes"][0]["title"].should.eql("Pea");
                    res.body.data[1]["recipes"][0]["ingredients"].should.be.a('array').length(2);
                    done();
                });
            });

            it('should post new recipe to old box', (done) => {
                chai.request(server)
                .post("/api/beverages")
                .send({
                    title: "Mimosa ",
                    ingredients: "orange juice",
                    directions: "enjoy"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array').length(3);
 
                    res.body.data[0]["recipes"].should.be.a('array').length(1); //beverages
                    res.body.data[1]["recipes"].should.be.a('array').length(2); //dessert
                    res.body.data[2]["recipes"].should.be.a('array').length(1); //soups

                    res.body.data[0]["recipes"][0]["title"].should.eql("Mimosa");
                    res.body.data[0]["recipes"][0]["ingredients"].should.be.a('array').length(1);
                    done();
                });
            });
        });
    });
});