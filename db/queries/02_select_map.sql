SELECT markers.*
FROM markers
JOIN maps ON maps.id = markers.map_id
WHERE maps.id = 1;
