const loadMapsFeed = function() {
  $.get('/api/maps/')
    .then(maps => maps.forEach(map => addMap(map)));
};

const addMap = function(map) {
  $.get('/api/favorites/')
    .then(favoritedMaps => {
      let html;
      const favArray = [];
      favoritedMaps.forEach(favoritedMap => {
        favArray.push(favoritedMap.id);
      });

      if (favArray.includes(map.id)) { // if the user has favorited the map, use a full heart icon
        html = `
          <div class="map" id="map-${map.id}">
            <div class="title-container">
              <h3>${map.name}</h3>
              <h5>${map.city}</h5>
            </div>
            <a href="" class='favorite-map favorited' id="favorite-map-${map.id}"><i class="fas fa-heart"></i></a>
          </div>`;
      } else { // if not, use an empty heart icon
        html = `
          <div class="map" id="map-${map.id}">
            <div class="title-container">
              <h3>${map.name}</h3>
              <h5>${map.city}</h5>
            </div>
            <a href="" class='favorite-map' id="favorite-map-${map.id}"><i class="far fa-heart"></i></a>
          </div>`;
      };

      $('#maps-container').prepend(html);
      $(`#map-${map.id}`).trigger('click');
    });
};

const loadFavoritesFeed = function() {
  $.get('/api/favorites/')
    .then(maps => maps.forEach(map => addMap(map)));
};

const loadMyMaps = function() {
  $.get('/api/maps/user/:user')
    .then(res => {
      if (!res) {
        return;
      };

      res.forEach(map => addMap(map));
    });
};
