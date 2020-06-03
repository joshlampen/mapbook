//Fetch user info
const findUser = (email, db) => {
  const query = `
  SELECT * FROM users
  WHERE email = $1
  `;

  return db.query(query, [email])
  .then(res => res.rows[0])
  .catch(err => err);
};

const addUser = (user, db) => {
  // const name = user.name;
  const email = user.email;
  // const password = user.password;
  // const password = bcrypt.hashSync(user.password, 10);

  const query = `
  INSERT INTO users (email)
  VALUES ($1)
  RETURNING *
  `;

  return db.query(query, [email])
  .then(res => res.rows[0])
  .catch(err => err);
};

//Add favourites
const favorite = (userId, mapId) => {
  const query =`
  INSERT INTO favorites (user_id, map_id)
  VALUES ($1, $2)
  `

  return db.query(query, [userId, mapId])
  .then()
  .catch(err => err);
};

//getFavorites
const getFavorites = (user_id) => {
  const query = `
  SELECT * FROM favorites
  WHERE user_id = $1
  `;

  return db.query(query, [user_id])
  .then(res => res.rows)
  .catch(err => err);
};

//Get user's maps
const getUserMaps = function(user_id, db) {
  const query = `
  SELECT * FROM maps
  WHERE user_id = $1
  `;

  return db.query(query, [user_id])
  .then(data => data.rows)
  .catch(err => console.log('Error', err.stack));
};


module.exports = { addUser, findUser, getUserMaps };
