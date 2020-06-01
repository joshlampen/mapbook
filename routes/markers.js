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
  })

  //Upon clicking a suggested address, save to db
  router.post('/', (req, res) => {
    const mapID = req.body.mapID;
    const markerName = req.body.markerName;
    const iconURL = req.body.iconURL;
    const lat = req.body.lat;
    const lng = req.body.lng;

    const values = [mapID, markerName, iconURL, lat, lng];

    return db.query(`
    INSERT INTO markers (map_id, name, icon_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `, values)
      .then(data => res.json(data.rows))
      .catch(e => e);
  })

  router.post('/delete', (req, res) => {
    const markerID = req.body.markerID;
    const mapID = req.body.mapID;

    const values = [markerID, mapID];

    return db.query(`
    DELETE FROM markers
    WHERE id = $1
    AND map_id = $2;
    `, values)
  })

  return router;
};