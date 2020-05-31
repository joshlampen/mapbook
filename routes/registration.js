const express = require('express');
const router  = express.Router();
const { addUser } = require('../db/dbFunctions')

module.exports = (db) => {

router.get('/', (req, res) => {
  res.render('registration');
  })

router.post("/" , (req,res) => {


  addUser(req.body, db)
  res.render('registration') // 'Registration' was used as a test page but it should render homepage after
  })

  return router;
}

/* Outstanding items to do:

- use Bcrypt to hash the password. Look in to 'addUser' function in db/dbFunctions.js */


