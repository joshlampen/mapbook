//Eventually, we will use this page to highlight the favorited maps in the feed
//Is connected!

$(document).ready(function() {
  //Set an event listener that will log the favorited maps
  google.maps.event.addDomListener(window, 'load', function() {
    $.get('/api/maps/favorites/', function(data) {
      console.log(data)
    })
    //$.post('/api/maps/favorites/', values) - Will uncomment this once all the HTML is set up
  })
});
