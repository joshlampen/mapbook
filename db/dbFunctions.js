const bcrypt = require('bcrypt');

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

//Get markers and load to map -- Incomplete, need to connect to db and append dynamically as a script
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

//Register users - Needs to connect to front-end and db like in lightBnb
const addUser = (user, db) => {
  const name = user.name;
  const email = user.email;
  const password = bcrypt.hashSync(user.password, 10);

  const query = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  SELECT *
  `
  return db.query(query, [name, email, password])
  .then(res => res.rows[0])
  .catch(err => console.error("Error", err.stack));
}


//Add favourites
const favorite = (userId, mapId) => {
  const query =`
  INSERT INTO favorites (user_id, map_id)
  VALUES ($1, $2)
  `

  return db.query(query, [userId, mapId])
  .then()
  .catch(err => console.error("Error", err.stack));
}

//getFavorites
const getFavorites = (user_id) => {
  const query = `
  SELECT * FROM favorites
  WHERE user_id = $1
  `

  return db.query(query, [user_id])
  .then(res => console.log(res.rows))
  .catch(err => console.log("Error", err.stack))

}

module.exports = { addUser }
