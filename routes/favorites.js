const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //Get all the favorited maps - Works! Will need to modify once we have all the ids
  router.get('/', (req, res) => {
    const query = `
    SELECT * FROM favorites
    `
    //WHERE user_id = $1
    return db.query(query)
    .then(res => {
      console.log(res.rows)
    })
    .catch(err => console.log("Error", err.stack))

  })

  //Favorite a map -- Will develop this further once favorites functionality has been setup
  router.post('/', (req, res) => {
    const query =`
    INSERT INTO favorites (user_id, map_id)
    VALUES ($1, $2)
    `

    return db.query(query, [userId, mapId])
    .then()
    .catch(err => console.error("Error", err.stack));
  })

  return router;
};