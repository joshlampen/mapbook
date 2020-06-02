$(document).ready(function() {
  const $createButton = $('#create');
  const $profileButton = $('#profile');
  const $dropdown = $('#dropdown');

  const $registerDiv = $('#register');
  const $registerForm = $registerDiv.find('#register-form');

  const $enterNameDiv = $('#enter-map-name');
  const $enterNameForm = $enterNameDiv.find('#new-map-name'); // where the user submits the map name
  const $nameInput = $enterNameForm.find('input');
  const $cancelCreate = $enterNameDiv.find('a');

  const $newMapContainer = $('#new-map'); // container that appears following map name submission
  const $newMapHeader = $newMapContainer.find('h2'); // dynamic header of container based on map name submission
  const $markerContainer = $newMapContainer.find('#marker-container');
  const $submitMapButton = $newMapContainer.find('#submit-map-button');
  const $cancelSubmit = $newMapContainer.find('#cancel-create');

  const $map = $('#maps-container').find('div');

  loadMap(); // load empty map
  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched
  enableMapShow();

  $enterNameDiv.hide();
  $newMapContainer.hide(); // hide the new map container initially
  $dropdown.hide();
  $registerDiv.hide();

  $profileButton.click(function() {
    event.preventDefault();
    $.post('/')
      .done(() => {
        if ($dropdown.is(':hidden')) {
          $dropdown.slideDown();
        } else {
          $dropdown.slideUp();
        }
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.fadeOut();
        }
      });
  })

  $createButton.click(function() {
    event.preventDefault();
    $.post('/')
      .done(() => {
        if ($enterNameDiv.is(":hidden")) {
          $nameInput.val('');
          $enterNameDiv.fadeIn();
        } else {
          $enterNameDiv.fadeOut();
        }

        if ($newMapContainer.is(":visible")) {
          $enterNameDiv.hide();
          cancelMap($newMapContainer);
        }
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.fadeOut();
        }
      });
  })

  $enterNameForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    $enterNameDiv.fadeOut();
    createNewMap($nameInput, $newMapContainer, $newMapHeader); // hide the map name submission container, show new map container
  })

  $cancelCreate.click(function() {
    event.preventDefault();
    $enterNameDiv.fadeOut();
  })

  $submitMapButton.click(function() {
    submitMap($newMapContainer, $markerContainer);
  })

  $cancelSubmit.click(function() {
    cancelMap($newMapContainer);
  })

  $registerForm.submit(function(event) {
    event.preventDefault();
    const values = $registerForm.serialize();
    
    $.post('/users/register/', values)
    $('#map').removeClass('greyscale');
    $registerDiv.fadeOut();
  })

  $('#maps-container').on('click', '.favorite-map', function() {
    const mapID = $(this).attr('id').slice(13)
    $.post('/api/favorites/', {mapID})
  })
});
