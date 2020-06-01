const express = require('express');
const router  = express.Router();
const { addUser } = require('../db/dbFunctions')

//const cookieSession = require('cookie-session')

module.exports = (db) => {

router.get('/', (req, res) => {
    res.render('registration');
  })

router.post("/" , (req,res) => {

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
  res.redirect('/')
  })

  return router;
}




