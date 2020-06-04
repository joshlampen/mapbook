const createNewMap = function(mapForm, newMapContainer) {
  const entry = mapForm.serialize();
  const header = newMapContainer.find('h2');
  const subHeader = newMapContainer.find('h4');

  $.post('/api/maps/', entry)
    .then(res => {
      const mapName = res[0].name;
      const city = res[0].city;
      header.html(mapName);
      subHeader.html(city);
      newMapContainer.fadeIn();
    });
};

const getMapName = function() {
  return $('#new-map').find('h2').html();
};

const addMarker = function(marker) {
  const html = `
  <div class="new-map-marker" id="marker-${marker.id}">
    <div>
      <img src=${marker.icon_url}>
      <p>${marker.name}</p>
    </div>
    <a href="" id="remove-marker-${marker.id}"><i class="fas fa-trash-alt"></i></a>
  </div>
  `;

  $('#marker-container').prepend(html);
  $('#search').val('');
};

const enableMarkerRemoval = function(markerID, mapID) {
  const $div = $(`#marker-${markerID}`);
  const $button = $div.find(`#remove-marker-${markerID}`);

  $button.click(function(event) {
    event.preventDefault();

    const values = {
      markerID,
      mapID
    };

    $.post('/api/markers/delete', values);

    $div.remove();
  });
};

const submitMap = function(newMapContainer, markerContainer) {
  event.preventDefault();
  newMapContainer.fadeOut();
  markerContainer.empty();

  const mapName = getMapName();

  $.get(`/api/maps/${mapName}`)
    .then(res => {
      const map = res[0];
      addMap(map);
    });
};

const cancelMap = function(event, newMapContainer) {
  event.preventDefault();
  const $markerContainer = newMapContainer.find('#marker-container');
  $markerContainer.empty();

  newMapContainer.hide();

  const mapName = getMapName();

  $.get(`/api/maps/${mapName}`)
    .then(res => {
      const mapID = res[0].id;
      $.post('/api/maps/delete', { mapID });
    });
};
