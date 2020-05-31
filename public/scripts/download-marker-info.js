$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', function() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      const place = autocomplete.getPlace();

      const name = place.name;
      const iconURL = place.icon;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const values = {
        name,
        iconURL,
        lat,
        lng
      };

      $.post('/api/maps/', values);
    })
  })
});