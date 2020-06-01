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
