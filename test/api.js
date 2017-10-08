//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Book = require('../routes/models/api').Book;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Box', () => {
    before((done) => {
        Book.remove({}, (err) => {
            console.log("RECIPE BOX DELETED BEGIN");
            done();
        });
    });

    describe('set up db', () => {
        let book;

        before((done) => {     
            chai.request(server)
            .get("/api")
            .end((err, res) => {
                book = res.body;
                console.log("READY")
                done();
            });
        });

        after((done) => {
            Book.remove({}, (err) => {
                console.log("RECIPE BOX DELETED");
                done();
            });
        });

        describe('/GET recipe box', () => {
            it('should get all recipe boxes in alphabetical order', (done) => {
                chai.request(server)
                .get("/api")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.box.should.be.a('array').length(17);
                    res.body.box[0]["recipes"].should.be.a('array').length(3);
                    done();
                });
            });
        });
    });
});