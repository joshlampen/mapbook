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

const addMarker = function(marker) {
  const html = `
  <div class="marker"">
    <img src=${marker.icon_url}>
    <p>${marker.name}</p>
    <i class="fas fa-trash-alt remove-marker"></i>
  </div>
  `;

  $('#marker-container').prepend(html);
  $('#search').val('');
}