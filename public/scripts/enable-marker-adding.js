const markerPositions = [];

const enableMarkerAdding = function() {
  google.maps.event.addDomListener(window, 'load', function() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));

    google.maps.event.addListener(autocomplete, 'place_changed', function() {

      $('#error-message').hide();
      const mapName = getMapName();

      $.get(`/api/maps/${mapName}`)
        .then(res => {
          const mapID = res[0].id;
          const place = autocomplete.getPlace();

          const markerName = place.name;
          const iconURL = place.icon;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const values = {
            mapID,
            markerName,
            iconURL,
            lat,
            lng
          };

          checkCoordinates([lat, lng], values, mapID);

        });
    });
  });
};

const checkCoordinates = (incomingCoords, queryVals, mapId) => {
  $.get('/api/markers/', { mapID:mapId })
  .then(res => {
    //If the coordinates are not in the db, make a get and post request
    if (!res.find(obj => obj.latitude === incomingCoords[0] && obj.longitude === incomingCoords[1])) {
      $.post('/api/markers/', queryVals)
      .then(() => {
        $.get('/api/markers/', { mapID:mapId })
          .then(res => {
            const marker = res[0];
            $('#error-message').hide()
            addMarker(marker);
            enableMarkerRemoval(marker.id, marker.map_id);
          });
      });
    } else {
      $('#error-message').addClass('new-map-error');
      $('#error-message').find('p').html('Please enter a new location.');
      $('#error-message').slideDown(300);
    }

  })
}
