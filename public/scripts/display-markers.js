const displayMarkers = (coordinates) => {
  const options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10,
    disableDefaultUI: true
  };
  const map = new google.maps.Map(document.getElementById('map'), options);
  const bounds = new google.maps.LatLngBounds();
  const markers = []

  coordinates.forEach(markerInfo => {
    markers.push(new google.maps.Marker({
      //Here we put in any details we want. We can insert that info into an infoWindow such that when we click the icon, the infow window shows
      map: map,
      title: markerInfo.name,
      position: {lat: markerInfo.latitude, lng: markerInfo.longitude}
    }));
  })

  //Centers the map such that we can see all the markers
  markers.forEach(marker => bounds.extend(marker.position))

  map.fitBounds(bounds);
}

$(document).ready(function () {
  google.maps.event.addDomListener(window, 'load', function() {
    $.get('api/maps/markers', displayMarkers)
  })
})
