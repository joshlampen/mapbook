/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const query = `
    SELECT *
    FROM markers
    `
    // WHERE map_id = $1
    return db.query(query)
    .then(res => {
      console.log(res.rows);
      //Formats into geoJson, but this needs to be appended dynamically as a script
      // map.data.addGeoJson(toGeoJson(data.rows))
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  //Upon clicking a suggested address, save to db
  router.post('/', (req, res) => {
    const name = req.body.name;
    const iconURL = req.body.iconURL
    const lat = Number(req.body.lat);
    const lng = Number(req.body.lng);

    const values = [name, iconURL, lat, lng]

    return db.query(`
    INSERT INTO markers (name, icon_url, latitude, longitude)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, values)
      .then(res => console.log(res.rows))
      .catch(e => console.log(e));
  })

  //Get all the favorited maps - Works! Will need to modify once we have all the ids
  router.get('/favorites', (req, res) => {
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

  //Favorite a map -- connect this to the front-end in another jquery file
  router.post('/favorites', (req, res) => {
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



