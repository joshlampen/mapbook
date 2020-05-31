/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //Will need to expand on this once we can register users
  router.post("/users", (req, res) => {
    const name = req.name
    const password = req.password
    const email = req.email
    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    `
    return db.query(query, [name, email, password])
    .then(res => res.rows[0])
    .catch(err => console.error("Error", err.stack));
  })

  //Create route to get user info

  return router;
};
