const enableMapShow = function() {
  google.maps.event.addDomListener(window, 'load', function() {
    $('#maps-container').on( 'click', '.map', function () {
      const mapID = $(this).attr('id').slice(4);
      showMap(mapID);
    });
  })
};

const showMap = function(mapID) {
  cancelMap($('#new-map'));
  $('#marker-container').empty();

  $.get('api/markers/', { mapID })
    .done(markers => {
      displayMarkers(markers);
    })
}

const displayMarkers = (markers) => {
  const options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10,
    maxZoom: 15,
    disableDefaultUI: true
  };
  const map = new google.maps.Map(document.getElementById('map'), options);
  const bounds = new google.maps.LatLngBounds();
  const locations = [];

  markers.forEach(marker => {

    const service = new google.maps.places.PlacesService(map);

    const request = {
      query: marker.name,
      fields: ['formatted_address']
    }

    service.findPlaceFromQuery(request, function(results, status) {
      console.log("inside of marker.forEach")
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        const googleMarker = new google.maps.Marker({
          map: map,
          title: marker.name,
          address: results[0].formatted_address,
          position: {lat: marker.latitude, lng: marker.longitude},
          icon: marker.icon_url
        });

        const text =
        `name: ${googleMarker.title}
        address: ${googleMarker.address}
        ${googleMarker.icon}
        `
        const infoWindow = new google.maps.InfoWindow({
          content: text
        });

        infoWindow.open(map, googleMarker);
        locations.push(googleMarker);
        bounds.extend(googleMarker.position);
      };
    })
  })

  //Centers the map such that we can see all the markers
  //locations.forEach(marker => bounds.extend(marker.position));

  map.fitBounds(bounds);
}
