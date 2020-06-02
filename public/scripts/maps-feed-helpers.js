const loadMapsFeed = function() {
  $.get('/api/maps/')
    .done(maps => maps.forEach(map => addMap(map)));
}

const addMap = function(map) {
  const html = `
  <div class="map" id="map-${map.id}">
  <div class="title-container">
    <h4>${map.name}</h4>
    <h6>Insert City Here</h6>
  </div>
    <button class='favorite-map' id="favorite-map-${map.id}"><i class="far fa-heart"></i></button>
  </div>
  `;

  $('#maps-container').prepend(html);

  $(`#map-${map.id}`).trigger('click');
}


