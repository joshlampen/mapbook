const loadMapsFeed = function() {
  $.get('/api/maps/')
    .then(maps => maps.forEach(map => addMap(map)));
};

const addMap = function(map) {
  $.get('/api/maps/user')
    .then(userMaps => {
      let icons = '';
      const userMapsArr = [];
      userMaps.forEach(userMap => userMapsArr.push(userMap.id));

      if (userMapsArr.includes(map.id)) { // if the map being added is one of the user's maps, add a pen icon
        icons = `<a href="" class='edit-map' id="edit-map-${map.id}"><i class="far fa-edit"></i></a>`;
      };

      $.get('/api/favorites/')
        .then(favoritedMaps => {
          const favArray = [];
          favoritedMaps.forEach(favoritedMap => favArray.push(favoritedMap.id));

          if (favArray.includes(map.id)) { // if the user has favorited the map, use a full heart icon
            icons += `<a href="" class="favorite-map favorited" id="favorite-map-${map.id}"><i class="fas fa-heart"></i></a>`;
          } else { // otherwise, use an empty heart icon
            icons += `<a href="" class="favorite-map" id="favorite-map-${map.id}"><i class="far fa-heart"></i></a>`;
          };

          const html = `
            <div class="map" id="map-${map.id}">
              <div class="title-container">
                <h3>${map.name}</h3>
                <h5>${map.city}</h5>
              </div>
              <div class="icon-container">
                ${icons}
              </div>
            </div>`;

          $('#maps-container').prepend(html);
          $(`#map-${map.id}`).trigger('click');
        });
    });
};

const loadFavoritesFeed = function() {
  $.get('/api/favorites/')
    .then(maps => maps.forEach(map => addMap(map)));
};

const loadMyMaps = function() {
  $.get('/api/maps/user')
    .then(res => {
      if (!res) {
        return;
      };
      res.forEach(map => addMap(map));
    });
};

const loggedName = function () {
  $.get('/users/register/name')
    .then(res => {
      let html = `
      <p>User logged in as: ${res[0].name}</p>
      `;
      $('#logged-name').prepend(html);
      $('#logged-name').fadeIn();
    })
    .catch(() => $('#logged-name').hide());
};