const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const { getUserMaps } = require('../db/dbFunctions');

module.exports = (db) => {
  router.get('/', (req, res) => {
    return db.query(`
    SELECT maps.*
    FROM maps
    WHERE id IN (SELECT map_id FROM markers)
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

  //Get maps for a specific user
  router.get('/user', (req, res) => {
    const userID = req.session.user_id;

    getUserMaps(userID, db)
      .then(data => res.json(data));
  });

  router.get('/:mapName', (req, res) => { // gets id based on name and user_id
    const mapName = req.params.mapName;
    const userID = req.session.user_id;

    const values = [mapName, userID];

    return db.query(`
    SELECT *
    FROM maps
    WHERE name = $1
    AND user_id = $2
    ORDER BY date_created;
    `, values)
      .then(data => res.json(data.rows));
  });

  return router;
};
