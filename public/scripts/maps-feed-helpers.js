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

const loadFavoritesFeed = function () {
  $.get('/api/favorites/')
  .done(favs => {
    return favs.forEach(map => addMap(map))
  });
}

const loadMyMaps = function () {
  $.get('/api/maps/user/:user', function (data) {
    if (!data) {
      return;
    }
    data.forEach(map => addMap(map))
  })
}

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

