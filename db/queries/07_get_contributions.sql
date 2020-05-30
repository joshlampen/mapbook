SELECT maps.*
FROM maps
JOIN contributions ON contributions.map_id = maps.id
WHERE contributions.user_id = 1;
