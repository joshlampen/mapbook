const createNewMap = function(form, newMap, newMapHeader) {
  event.preventDefault();

  const entry = form.serialize();
  const mapName = entry.slice(5);

  $.post('/api/maps/', entry)

  form.fadeOut();

  newMapHeader.html(mapName);
  newMap.fadeIn();
};

const getMapName = function() {
  return $('#new-map').find('h2').html();
}