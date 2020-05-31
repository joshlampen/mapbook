//db functions

//Helper function - Take the array of lat and long values and convert to geoJson
const toGeoJson = array => {
  let geoJson = {
    "type": "User destinations",
    "features": []
  }

  array.forEach(queryObj => {
    let featuresObject = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": []
      }
    }
    featuresObject.geometry.coordinates = [queryObj.latitude, queryObj.longitude];
    toGeoJson.features.push(featuresObject);
  })
  return geoJson;
};

//Get markers and load to map
const getMarkers = mapId => {
  const query = `
  SELECT latitude, longitude FROM markers
  WHERE map_id = $1
  `
  return db.query(query, [mapId])
  .then(data => {
    //Formats into geoJson, but this needs to be appended dynamically as a script
    map.data.addGeoJson(toGeoJson(data.rows))
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
};
