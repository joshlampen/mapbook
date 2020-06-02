const enableMapShow = function() {
  google.maps.event.addDomListener(window, 'load', function() {
    $('#maps-container').on( 'click', '.map', function() {
      const mapID = $(this).attr('id').slice(4);
      showMap(mapID);
    });
  })
};

const showMap = function(mapID) {
  $('#marker-container').empty();

  $.get('api/markers/', { mapID })
    .done(markers => {
      displayMarkers(markers);
    })
}

const geoLocator = function(map) {
  const infoWindow = new.google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const presentLocationMarker = new google.maps.Marker({
        map: map,
        position: {lat: pos.lat, lng: pos.lng},
        title: "Your location!",
        image: 'https://image.flaticon.com/icons/svg/846/846551.svg'
      });

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found');
      infoWindow.open(map, presentLocationMarker);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

const handleLocationError = function(browserHasGeoLoc, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
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

  //Geolocation
  geoLocator(map);

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
