//Note, url path is /api/registration

const express = require('express');
const router  = express.Router();
const { addUser, findUser, } = require('../db/dbFunctions')
const cookieSession = require('cookie-session')

module.exports = (db) => {

router.get('/', (req, res) => {
    res.render('registration');
  })

router.post("/" , (req,res) => {

  // Here I want to verify if the user is already in the db, currently stuck
  findUser(req.body, db)
  .then(res => {
    res.send('Already taken');
    return;
  })

  addUser(req.body, db)
  //Here to the end of the function was taken from LightBnB
  .then(user => {
    if (!user) {
      res.send({error: "error"});
      return;
    }
    req.session.userId = user.id;
    res.send("🤗");
  })
  .catch(e => res.send(e));
  res.render('registration') // 'Registration' was used as a test page but it should render homepage after
  })

  return router;
}



/* Outstanding items to do:

- use Bcrypt to hash the password. Look in to 'addUser' function in db/dbFunctions.js */


