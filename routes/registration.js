const express = require('express');
const router  = express.Router();
const { addUser } = require('/db/dbFunctions.js');

module.exports = (db) => {

  router.get("/registration" , (req,res) => {
    res.render('registration');
  })

  router.post("/registration" , (req, res) => {

    addUser(req.body)

  })

return router


}

/*

const addUser = user => {
  const name = user.name;
  const email = user.email;
  const password = user.password;

  const query = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  `
  return db.query(query, [name, email, password])
  .then(res => res.rows[0])
  .catch(err => console.error("Error", err.stack));
}
*/
