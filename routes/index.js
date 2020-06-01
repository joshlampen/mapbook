const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { findUser } = require('../db/dbFunctions');
const cookieSession = require('cookie-session');


module.exports = (db) => {

  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    console.log(userID);

    if (userID) {
      res.render('index')
    } else {
      res.redirect('/user/register/')
    }
  })

  return router;
};