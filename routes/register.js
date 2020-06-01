const express = require('express');
const router  = express.Router();
const { addUser, findUser, } = require('../db/dbFunctions')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

module.exports = (db) => {

  router.get('/', (req, res) => {
    res.render('register');
  })

  router.post("/" , (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

    const values = [name, email, password]

    return db.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `, values)
      .then(res => {
        const user = res.rows[0];
        req.session.user_id = user.id;
        res.redirect('/');
      }) 
      .catch(e => e);

    // // Here I want to verify if the user is already in the db, currently stuck
    // findUser(req.body, db)
    // .then(res => {
    //   res.send('Already taken');
    //   return;
    // })

    // addUser(req.body, db)
    // //Here to the end of the function was taken from LightBnB
    // .then(user => {
    //   if (!user) {
    //     res.send({error: "error"});
    //     return;
    //   }
    //   req.session.userId = user.id;
    //   res.send("🤗");
    // })
    // .catch(e => res.send(e));
    // res.redirect('/')
  })

  return router;
}




