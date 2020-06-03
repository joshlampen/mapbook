/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const { getUserMaps } = require('../db/dbFunctions');

module.exports = (db) => {
  router.get('/', (req, res) => {
    return db.query(`
    SELECT *
    FROM maps
    ORDER BY date_created;
    `)
      .then(data => res.json(data.rows));
  });

  router.post('/', (req, res) => {
    const mapName = req.body.name;
    const city = req.body.city;
    const userID = req.session.user_id;

    const values = [mapName, city, userID];

    return db.query(`
    INSERT INTO maps (name, city, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, values)
      .then(data => res.json(data.rows));
  });

  router.post('/delete', (req, res) => {
    const mapID = req.body.mapID;
    const userID = req.session.user_id;

    const values = [mapID, userID];

    return db.query(`
    DELETE FROM maps
    WHERE id = $1 AND user_id = $2;
        `, values);
  });

  router.get('/:mapName', (req, res) => { // gets id based on name and user_id
    const mapName = req.params.mapName;
    const userID = req.session.user_id;

    const values = [mapName, userID];

    return db.query(`
    SELECT *
    FROM maps
    WHERE name = $1
    AND user_id = $2;
    `, values)
      .then(data => res.json(data.rows));
  });

  //Get maps for a specific user
  router.get('/user/:user', (req, res) => {
    const userID = req.session.user_id;

    getUserMaps(userID, db)
    .then(data => res.json(data));
  });

  return router;
};
