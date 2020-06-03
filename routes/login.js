/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
// const bcrypt = require('bcryptjs');
const { findUser } = require('../db/dbFunctions');
const cookieSession = require('cookie-session');


module.exports = (db) => {

  router.get('/', (req, res) => {
    res.render('login')
  })

  // router.post("/", (req, res) => {
  //     const {email, password} = req.body;
  //     findUser(email, db)
  //     .then(user => {
  //       if(bcrypt.compareSync(password, user.password)) {
  //         req.session.user_id = user.id;
  //         console.log(req.session.user_id)
  //         console.log(user)
  //         res.redirect('/')
  //       } else {
  //         res.send('Error')
  //       }
  //     })
  //     })

  return router;
};


