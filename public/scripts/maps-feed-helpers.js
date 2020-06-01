const loadMapsFeed = function() {
  $.get('/api/maps/')
    .done(maps => maps.forEach(map => addMap(map)));
}

const addMap = function(map) {
  const html = `
  <div class="map" id="map-${map.id}">
    <h4>${map.name}</h4>
    <button id="favorite-map-${map.id}"><i class="far fa-heart"></i></button>
  </div>
  `;

  $('#maps-container').prepend(html);
  $(`#map-${map.id}`).trigger('click');
}