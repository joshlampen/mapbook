const enableMarkerAdding = function() {
  google.maps.event.addDomListener(window, 'load', function() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      const mapName = getMapName();

      $.get(`/api/maps/${mapName}`)
        .done(res => {
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

          $.post('/api/markers/', values)
            .done(() => {
              $.get('/api/markers/', { mapID })
                .done(res => {
                  const marker = res[0];

                  addMarker(marker);
                  enableMarkerRemoval(marker.id, marker.map_id);
                });
            })
        })
    })
  })
};
