const loadMapsFeed = function() {
  $.get('/api/maps/')
    .done(maps => maps.forEach(map => addMap(map)));
}

const addMap = function(map) {
  $.get('/api/favorites/')
    .done(favoritedMaps => {
      let html;
      const favArray = []
      favoritedMaps.forEach(favoritedMap => {
        favArray.push(favoritedMap.id);
      })

      if (favArray.includes(map.id)) {
        html = `
          <div class="map" id="map-${map.id}">
            <div class="title-container">
              <h3>${map.name}</h3>
              <h5>${map.city}</h5>
            </div>
            <a href="" class='favorite-map favorited' id="favorite-map-${map.id}"><i class="fas fa-heart"></i></a>
          </div>`;
      } else {
        html = `
        <div class="map" id="map-${map.id}">
          <div class="title-container">
            <h3>${map.name}</h3>
            <h5>${map.city}</h5>
          </div>
          <a href="" class='favorite-map' id="favorite-map-${map.id}"><i class="far fa-heart"></i></a>
        </div>`;
      }

      $('#maps-container').prepend(html);
      $(`#map-${map.id}`).trigger('click');
    })
}

const loadFavoritesFeed = function() {
  $.get('/api/favorites/')
    .done(maps => maps.forEach(map => addMap(map)));
}

const loadMyMaps = function() {
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

