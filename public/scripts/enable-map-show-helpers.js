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

  $.get('/api/markers/', { mapID })
    .done(markers => {
      displayMarkers(markers);
    })
}

// const geoLocator = function(map) {
//   let infoWindow = new google.maps.InfoWindow;

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       const pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       const presentLocationMarker = new google.maps.Marker({
//         map: map,
//         position: {lat: pos.lat, lng: pos.lng},
//         title: 'You Are Here',
//         // icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
//       });

//       infoWindow.setPosition(pos);
//       infoWindow.setContent('You Are Here');
//       infoWindow.open(map, presentLocationMarker);
//       map.setCenter(pos);
//     }, function() {
//       handleGeoLocatorError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     handleGeoLocatorError(false, infoWindow, map.getCenter());
//   }
// }

const getMyLocation = function(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const myLocation = new google.maps.Marker({
        map: map,
        position: {lat: pos.lat, lng: pos.lng},
        title: 'You Are Here',
        // icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
      });

      return myLocation;

    }, function() {
      handleGeoLocatorError(true, infoWindow, map.getCenter());
    });
  } else {
    handleGeoLocatorError(false, infoWindow, map.getCenter());
  }
}

const handleGeoLocatorError = function(browserHasGeoLoc, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

const displayMarkers = markers => {
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

    const googleMarker = new google.maps.Marker({
      map: map,
      title: marker.name,
      position: {lat: marker.latitude, lng: marker.longitude},
    });

    const service = new google.maps.places.PlacesService(map);

    const request = {
      query: marker.name,
      fields: ['formatted_address']
    }

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
        `

        const infoWindow = new google.maps.InfoWindow({
          content: html
        });

        googleMarker.addListener('mouseover', function() {
          infoWindow.open(map, googleMarker);
        })

        googleMarker.addListener('mouseout', function() {
          infoWindow.close(map, googleMarker);
        })

        // infoWindow.open(map, googleMarker);
        locations.push(googleMarker);
        bounds.extend(googleMarker.position);
      };
    })

    locations.push(googleMarker);
    bounds.extend(googleMarker.position); // Centers the map such that we can see all the markers
  })


  map.fitBounds(bounds);
}
