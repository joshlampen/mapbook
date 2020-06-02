$(document).ready(function () {

  google.maps.event.addDomListener(window, 'load', function() {
    $.get('/api/maps/user/:user', function (data) {
      //If there are no maps
      if (!data) {
        return;
      }
      //Want to dynamically create html
    })

  })

})
