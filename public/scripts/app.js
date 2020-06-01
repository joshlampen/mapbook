$(document).ready(function() {
  const $form = $('#new-map-name'); // where the user submits the map name
  const $newMapContainer = $('#new-map'); // container that appears following map name submission
  const $newMapHeader = $newMapContainer.find('h2'); // dynamic header of container based on map name submission
  const $submitMapButton = $newMapContainer.find('#submit-map-button')
  
  loadMap(); // load empty map
  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched

  $newMapContainer.hide(); // hide the new map container initially

  $form.submit(function(event) { // upon submission of map name...
    createNewMap($form, $newMapContainer, $newMapHeader); // hide the map name submission container, show new map container
  })

  $submitMapButton.click(function() {
    submitMap($newMapContainer);
  })
});