$(document).ready(function() {
  const $createButton = $('#create');

  const $enterNameDiv = $('#enter-map-name');
  const $enterNameForm = $enterNameDiv.find('#new-map-name'); // where the user submits the map name
  const $enterNameTextArea = $enterNameForm.find('textarea');
  const $cancelCreate = $enterNameDiv.find('a');

  const $newMapContainer = $('#new-map'); // container that appears following map name submission
  const $newMapHeader = $newMapContainer.find('h2'); // dynamic header of container based on map name submission
  const $submitMapButton = $newMapContainer.find('#submit-map-button');
  const $cancelSubmit = $newMapContainer.find('#cancel-create');
  
  loadMap(); // load empty map
  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched

  $enterNameDiv.hide();
  $newMapContainer.hide(); // hide the new map container initially

  $createButton.click(function() {
    event.preventDefault();

    if ($enterNameDiv.is(":hidden")) {
      $enterNameTextArea.val('');
      $enterNameDiv.fadeIn();
    } else {
      $enterNameDiv.fadeOut();
    }

    if ($newMapContainer.is(":visible")) {
      $enterNameDiv.hide();
      cancelMap($newMapContainer);
    }
  })

  $enterNameForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    $enterNameDiv.fadeOut();
    createNewMap($enterNameForm, $newMapContainer, $newMapHeader); // hide the map name submission container, show new map container
  })

  $cancelCreate.click(function() {
    event.preventDefault();
    $enterNameDiv.fadeOut();
  })

  $submitMapButton.click(function() {
    submitMap($newMapContainer);
  })

  $cancelSubmit.click(function() {
    cancelMap($newMapContainer);
  })
});