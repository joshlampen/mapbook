const addUser = (user, db) => {
  const firstName = user.firstname;
  const lastName = user.lastname;
  const email = user.email;

  const query = `
  INSERT INTO users (email)
  VALUES ($1)
  RETURNING *
  `;

  return db.query(query, [email])
  .then(res => res.rows[0])
  .catch(err => err);
};

const favorite = (userId, mapId) => {
  const query =`
  INSERT INTO favorites (user_id, map_id)
  VALUES ($1, $2)
  `

  return db.query(query, [userId, mapId])
  .then()
  .catch(err => err);
};

const getFavorites = (user_id) => {
  const query = `
  SELECT * FROM favorites
  WHERE user_id = $1
  `;

  return db.query(query, [user_id])
  .then(res => res.rows)
  .catch(err => err);
};

const getUserMaps = function(user_id, db) {
  const query = `
  SELECT * FROM maps
  WHERE user_id = $1
  `;

  return db.query(query, [user_id])
  .then(data => data.rows)
  .catch(err => err);
};


module.exports = { addUser, getUserMaps };
