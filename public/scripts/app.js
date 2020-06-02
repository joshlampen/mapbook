$(document).ready(function() {
  loadMap(); // load empty map

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
  const $favorites = $('#dropdown').find('a:contains("Favorites")');

  const $map = $('#maps-container').find('div');

  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched
  enableMapShow();

  $profileButton.click(function() {
    event.preventDefault();
    $.post('/')
      .done(() => {
        $dropdown.removeClass('hidden');
        if ($dropdown.is(':hidden')) {
          $dropdown.slideDown();
        } else {
          $dropdown.slideUp();
        }
      })
      .catch(() => {
        $registerDiv.removeClass('hidden');
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
          $enterNameDiv.removeClass('hidden');
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
          $registerDiv.removeClass('hidden');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.fadeOut();
        }
      });
  })

  $enterNameForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    $newMapContainer.removeClass('hidden');
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

  $favorites.click(function(event) {
    event.preventDefault()
    $( "#maps-container" ).empty()
    loadFavoritesFeed()
    /*
    $.post('/').done(() => {
      loadFavoritesFeed();
    })*/
  })


});
