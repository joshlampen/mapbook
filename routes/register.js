//Note, url path is /api/registration

const express = require('express');
const router  = express.Router();
const { addUser, findUser, } = require('../db/dbFunctions')
const cookieSession = require('cookie-session')

module.exports = (db) => {

router.get('/all', (req, res) => {
  return db.query(`
  SELECT * FROM users
  `)
  .then(data => res.json(data.rows));
});

router.post("/" , (req, res) => {

  // // Here I want to verify if the user is already in the db, currently stuck
  // findUser(req.body, db)
  // .then(res => {
  //   res.send('Already taken');
  //   return;
  // })
  console.log(req.body)
  addUser(req.body, db)
  //Here to the end of the function was taken from LightBnB
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      };
      req.session.user_id = user.id;
      res.redirect('/');
    });
    // .catch(e => res.send(e));
  });

  return router;
};




