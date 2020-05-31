//db functions

const getMarkers = mapId => {
  const query = `
  SELECT latitude, longitude FROM markers
  WHERE map_id = $1
  `
  return db.query(query, [mapId])
  .then(data => {
    //Need to format info into GEOJson and use a google function
    map.data.loadGeoJson(/* Query lat and long, but in GeoJSON form */)
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
}
