SELECT maps.*
FROM maps
JOIN favorites ON favorites.map_id = maps.id
WHERE favorites.user_id = 1;
