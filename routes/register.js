const express = require('express');
const router  = express.Router();
const { addUser } = require('../db/dbFunctions')
const cookieSession = require('cookie-session')

module.exports = (db) => {

router.get('/', (req, res) => {
  return db.query(`
  SELECT * FROM users
  `)
  .then(data => res.json(data.rows));
});

router.post('/' , (req, res) => {
  addUser(req.body, db)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      };
      req.session.user_id = user.id;
      res.redirect('/');
    });
  });

  return router;
};




