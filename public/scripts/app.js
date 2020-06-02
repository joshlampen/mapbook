$(document).ready(function() {
  loadMap(); // load empty map

  const $createButton = $('#create');
  const $profileButton = $('#profile');
  const $dropdown = $('#dropdown');

  const $registerDiv = $('#register');
  const $registerForm = $registerDiv.find('#register-form');

  const $mapInfoDiv = $('#enter-map-info');
  const $mapForm = $mapInfoDiv.find('#map-form'); // where the user submits the map name
  const $nameInput = $mapForm.find('input');
  const $cancelCreate = $mapInfoDiv.find('a');

  const $newMapContainer = $('#new-map'); // container that appears following map name submission
  const $markerContainer = $newMapContainer.find('#marker-container');
  const $submitMapButton = $newMapContainer.find('#submit-map-button');
  const $cancelSubmit = $newMapContainer.find('#cancel-create');
  const $favorites = $('#dropdown').find('a:contains("Favorites")');
  const $myMaps = $('#dropdown').find('a:contains("My Maps")');

  const $map = $('#maps-container').find('div');

  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched
  enableMapShow();

  $dropdown.hide();
  $registerDiv.hide();
  $mapInfoDiv.hide();
  $newMapContainer.hide()

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
        if ($mapInfoDiv.is(":hidden")) {
          $nameInput.val('');
          $mapInfoDiv.fadeIn();
        } else {
          $mapInfoDiv.fadeOut();
        }

        if ($newMapContainer.is(":visible")) {
          $mapInfoDiv.hide();
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

  $mapForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    $mapInfoDiv.fadeOut();
    createNewMap($mapForm, $newMapContainer); // hide the map name submission container, show new map container
  })

  $cancelCreate.click(function() {
    event.preventDefault();
    $mapInfoDiv.fadeOut();
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

  $favorites.click(function(event) {
    event.preventDefault()
    $( "#maps-container" ).empty()
    loadFavoritesFeed()
  })

  $myMaps.click(function(event) {
    event.preventDefault()
    $( "#maps-container" ).empty()
    loadMyMaps()
  })

});
