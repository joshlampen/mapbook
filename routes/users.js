/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { findUser } = require('../db/dbFunctions');
const cookieSession = require('cookie-session');


module.exports = (db) => {

  router.get('/', (req, res) => {
    res.render('login')
  })

  router.post("/", (req, res) => {

      const {email, password} = req.body;

      findUser(email, db)
      .then(user => {
        if(bcrypt.compareSync(password, user.password)) {
          req.session.user_id = user.id;
          res.redirect('/')
        }
      })
      })

  //Create route to get user info

  return router;
};


/* Outstanding items to do:

- Take login info from req.body and use a use query to call user info from the database.
Return error if SELECT * FROM users WHERE email = x AND password = y doesn't match req.body data (inputted email and password)


app.post('/login', (req, res,) => {
  const { email, password } = req.body;
  if (loginChecker(email, password, users) === 'NoEmail') {
    res.status(403);
    let templateVars = { username: null, errorMessage: `Email doesn't exist. Please register.` };
    res.render('errorPage', templateVars);
  } else if (loginChecker(email, password, users) === 'WrongP') {
    res.status(403);
    let templateVars = { username: null, errorMessage: `Password is incorrect. Please try again.` };
    res.render('errorPage', templateVars);
  } else {
    req.session.user_id = emailLookup(email, users);
    res.redirect('/urls');
  }
});

*/
