/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

module.exports = (db) => {
  router.get('/', (req, res) => {
    return db.query(`
    SELECT *
    FROM maps
    ORDER BY date_created;
    `)
      .then(data => res.json(data.rows));
  })

  router.post('/', (req, res) => {
    const mapName = req.body.text;

    const values = [mapName];

    return db.query(`
    INSERT INTO maps (name)
    VALUES ($1)
    RETURNING *;
    `, values)
      .then(data => res.json(data.rows));
  })

  router.post('/delete', (req, res) => {
    const mapID = req.body.mapID;

    const values = [mapID];

    return db.query(`
    DELETE FROM maps
    WHERE id = $1;
    `, values)
      .then(data => res.json(data.rows))
      .catch(e => e);
  })

  router.post('/markers/delete', (req, res) => {
    const markerID = req.body.markerID;
    const mapID = req.body.mapID;

    const values = [markerID, mapID];

    return db.query(`
    DELETE FROM markers
    WHERE id = $1
    AND map_id = $2;
    `, values)
  })

  //Get all the favorited maps - Works! Will need to modify once we have all the ids
  router.get('/favorites', (req, res) => {
    const userId = req.session.user_id
    const query = `
    SELECT * FROM favorites
    WHERE user_id = $1
    `
    return db.query(query, [userId])
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log("Error", err.stack))

  })

  //Favorite a map -- Will develop this further once favorites functionality has been setup
  router.post('/favorites', (req, res) => {
    const userId = req.session.user_id
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
