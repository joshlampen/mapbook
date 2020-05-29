$(document).ready(function() {
  let map;

  const createMap = function() {
    const options = {
      center: { lat: 43.654, lng: -79.383},
      zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map'), options);
  };

  createMap();
});

