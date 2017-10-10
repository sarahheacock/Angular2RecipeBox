// //During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// const mongoose = require("mongoose");
// const Book = require('../routes/models/api').Book;

// //Require the dev-dependencies
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../server');
// const should = chai.should();


// chai.use(chaiHttp);
// //Our parent block
// describe('Box', () => {
//     before((done) => {
//         Book.remove({}, (err) => {
//             console.log("RECIPE BOX DELETED BEGIN");
//             done();
//         });
//     });

//     describe('set up db', () => {
//         let book;

//         before((done) => {     
//             chai.request(server)
//             .get("/api")
//             .end((err, res) => {
//                 book = new Book(res.body);
//                 console.log("READY")
//                 done();
//             });
//         });

//         after((done) => {
//             Book.remove({}, (err) => {
//                 console.log("RECIPE BOX DELETED");
//                 done();
//             });
//         });

//         describe('/GET recipe box', () => {
//             before((done) => {
//                 book.createdAt = new Date("October 30, 2017");
//                 book.save((err, newBook) => {
//                     console.log("October 30, 2017");
//                     done();
//                 }); 
//             })
            
//             it('should get all recipe boxes in alphabetical order', (done) => {
//                 chai.request(server)
//                 .get("/api")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.box.should.be.a('array').length(17);
//                     res.body.box[0]["recipes"].should.be.a('array').length(3);
//                     res.body.box[8]["recipes"].should.be.a('array').length(25);
//                     done();
//                 });
//             });

            
//             before((done) => {
//                 book.createdAt = new Date("October 30, 2017");
//                 book.save((err, newBook) => {
//                     console.log("October 30, 2017");
//                     done();
//                 }); 
//             })

//             it('should not check for update if it has not been two weeks', (done) => {
//                 chai.request(server)
//                 .get("/api")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.box.should.be.a('array').length(17);
//                     res.body.box[8]["recipes"].should.be.a('array').length(25);
//                     res.body.created.should.eql(new Date("October 30, 2017"));
//                     done();
//                 });
//             });


//             before((done) => {
//                 book.createdAt = new Date("October 24, 2017");
//                 book.save((err, newBook) => {
//                     console.log("October 24, 2017");
//                     done();
//                 }); 
//             });
//             it('should check for update if its been two weeks', (done) => {
//                 chai.request(server)
//                 .get("/api")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.box.should.be.a('array').length(17);
//                     res.body.box[8]["recipes"].should.be.a('array').length(25);
//                     res.body.created.should.eql(new Date());
//                     done();
//                 });
//             });

//             before((done) => {
//                 book.createdAt = new Date("June 29, 2017");
//                 book.save((err, newBook) => {
//                     console.log("June 29, 2017");
//                     done();
//                 }); 
//             });
//             it('should update box if new entry present', (done) => {
//                 chai.request(server)
//                 .get("/api")
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.box.should.be.a('array').length(17);
//                     res.body.box[8]["recipes"].should.be.a('array').length(26);
//                     res.body.created.should.eql(new Date());
//                     done();
//                 });
//             });
//         });
//     });
// });