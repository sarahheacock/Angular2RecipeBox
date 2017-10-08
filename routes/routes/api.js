const express = require('express');
const router = express.Router();

const Book = require("../models/api").Book;
const scrape = require("../middleware/api");


//get the book
router.get('/', scrape.init, (req, res, next) => {
  res.json(req.book);
});

module.exports = router;

