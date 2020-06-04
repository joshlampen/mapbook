const showMap = function(mapID) {
  $('#marker-container').empty();

  $.get('/api/markers/', { mapID })
    .then(markers => {
      displayMarkers(markers);
    });
};

const displayMarkers = markers => {
  const options = {
    center: { lat: 43.654, lng: -79.383 }, // sets downtown Toronto as default center
    zoom: 10,
    maxZoom: 15,
    disableDefaultUI: true
  };

  const map = new google.maps.Map(document.getElementById('map'), options);
  const bounds = new google.maps.LatLngBounds();
  const locations = [];

  markers.forEach(marker => {
    const googleMarker = new google.maps.Marker({
      map: map,
      title: marker.name,
      position: {lat: marker.latitude, lng: marker.longitude},
    });

    const service = new google.maps.places.PlacesService(map);

    const request = {
      query: marker.name,
      fields: ['formatted_address']
    };

    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const googleMarker = new google.maps.Marker({
          map: map,
          title: marker.name,
          address: results[0].formatted_address,
          position: {lat: marker.latitude, lng: marker.longitude},
        });

        const html = `
        <div class="marker">
          <div>
            <h3>${googleMarker.title}</h3>
            <img src=${marker.icon_url}>
          </div>
          <p>${googleMarker.address}</p>
        </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: html
        });

        googleMarker.addListener('mouseover', function() {
          infoWindow.open(map, googleMarker);
        });

        googleMarker.addListener('mouseout', function() {
          infoWindow.close(map, googleMarker);
        });

        locations.push(googleMarker);
        bounds.extend(googleMarker.position);
      };
    });

    locations.push(googleMarker);
    bounds.extend(googleMarker.position); // Centers the map such that all markers are visible
  });

  map.fitBounds(bounds);
};
