const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const mapID = req.query.mapID;
    const values = [mapID]

    return db.query(`
    SELECT *
    FROM markers
    WHERE map_id = $1
    ORDER BY date_created DESC
    `
    , values)
      .then(data => {
        res.json(data.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

  //Upon clicking a suggested address, save to db
  router.post('/', (req, res) => {
    const mapID = req.body.mapID;
    const markerName = req.body.markerName;
    const iconURL = req.body.iconURL;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const userID = req.session.user_id;

    const values = [mapID, markerName, iconURL, lat, lng, userID];

    return db.query(`
    INSERT INTO markers (map_id, name, icon_url, latitude, longitude, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `, values)
      .then(data => res.json(data.rows))
      .catch(e => e);
  })

  router.post('/delete', (req, res) => {
    const markerID = req.body.markerID;
    const mapID = req.body.mapID;
    const userID = req.session.user_id;

    const values = [markerID, mapID, userID];

    return db.query(`
    DELETE FROM markers
    WHERE id = $1
    AND map_id = $2
    AND user_id = $3;
    `, values)
  })

  return router;
};
