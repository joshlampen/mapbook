const createNewMap = function(nameInput, newMapContainer, newMapHeader) {
  const entry = nameInput.serialize();

  $.post('/api/maps/', entry)
    .done(res => {
      const mapName = res[0].name
      newMapHeader.html(mapName);
      newMapContainer.fadeIn();
    })
};

const getMapName = function() {
  return $('#new-map').find('h2').html();
}

const addMarker = function(marker) {
  const html = `
  <div class="marker" id="marker-${marker.id}">
    <img src=${marker.icon_url}>
    <p>${marker.name}</p>
    <button id="remove-marker-${marker.id}"><i class="fas fa-trash-alt"></i></button>
  </div>
  `;

  $('#marker-container').prepend(html);
  $('#search').val('');
}

const enableMarkerRemoval = function(markerID, mapID) {
  const $div = $(`#marker-${markerID}`)
  const $button = $div.find(`#remove-marker-${markerID}`);

  $button.click(function() {
    const values = {
      markerID,
      mapID
    }

    $.post('/api/markers/delete', values);

    $div.remove();
  })
}

const submitMap = function(newMapContainer, markerContainer) {
  console.log('using submitMap')
  event.preventDefault();
  newMapContainer.fadeOut();
  markerContainer.empty();

  const mapName = getMapName();

  $.get(`/api/maps/${mapName}`)
    .done(res => {
      const map = res[0];
      addMap(map);
    })
}

const cancelMap = function(newMapContainer) {
  console.log('using cancelMap')
  event.preventDefault();
  newMapContainer.fadeOut();

  const mapName = getMapName();

  $.get(`/api/maps/${mapName}`)
    .done(res => {
      const mapID = res[0].id
      $.post('/api/maps/delete', { mapID })
    })
}
