const addUser = (user, db) => {
  const name = user.name;
  const email = user.email;

  const query = `
  INSERT INTO users (name, email)
  VALUES ($1, $2)
  RETURNING *
  `;

  return db.query(query, [name, email])
    .then(res => res.rows[0])
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
