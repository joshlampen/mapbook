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
    return db.query(`
    SELECT *
    FROM maps
    ORDER BY date_created;
    `)
      .then(data => res.json(data));
  })

  router.post('/', (req, res) => {
    const mapName = req.body.text;

    const values = [mapName];

    return db.query(`
    INSERT INTO maps (name)
    VALUES ($1)
    RETURNING *;
    `, values)
      .then(res => res.rows);
  })


  router.get('/markers', (req, res) => {
    const mapID = Number(req.query.mapID);
    const values = [mapID]

    return db.query(`
    SELECT *
    FROM markers
    WHERE map_id = $1
    ORDER BY date_created DESC;
    `, values)
      .then(data => {
        res.json(data.rows);
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
  router.post('/markers', (req, res) => {
    const mapID = req.body.mapID;
    const markerName = req.body.markerName;
    const iconURL = req.body.iconURL
    const lat = Number(req.body.lat);
    const lng = Number(req.body.lng);

    const values = [mapID, markerName, iconURL, lat, lng]

    return db.query(`
    INSERT INTO markers (map_id, name, icon_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5);
    `, values)
      .then(res => res.rows)
      .catch(e => e);
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

  //Favorite a map -- Will develop this further once favorites functionality has been setup
  router.post('/favorites', (req, res) => {
    const query =`
    INSERT INTO favorites (user_id, map_id)
    VALUES ($1, $2)
    `

    return db.query(query, [userId, mapId])
    .then()
    .catch(err => console.error("Error", err.stack));
  })

  router.get('/:mapName', (req, res) => { // gets id based on name and user_id
    const mapName = req.params.mapName;

    const values = [mapName]

    return db.query(`
    SELECT *
    FROM maps
    WHERE name = $1
    `, values)
      .then(data => res.json(data.rows));
  })

  return router;
};



