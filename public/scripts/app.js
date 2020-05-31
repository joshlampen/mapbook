$(document).ready(function() {
  const $form = $('#new-map-name'); // where the user submits the map name
  const $newMap = $('#new-map'); // container that appears following map name submission
  const $newMapHeader = $newMap.find('h2'); // dynamic header of container based on map name submission
  
  loadMap(); // load empty map
  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerInfo(); // enables download of location data when a place is searched

  $newMap.hide(); // hide the new map container initially

  $form.submit(function(event) { // upon submission of map name...
    createNewMap($form, $newMap, $newMapHeader); // hide the map name submission container, show new map container
  })
});
