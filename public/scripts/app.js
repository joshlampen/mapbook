$(document).ready(function() {
  loadMap(); // load empty map

  const $createButton = $('#create');
  const $profileButton = $('#profile');
  const $dropdown = $('#dropdown');

  const $registerDiv = $('#register');
  const $registerForm = $registerDiv.find('#register-form');
  const $registerInput = $registerDiv.find('input');
  const $cancelRegister = $registerDiv.find('a');

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

  const $mapsFeedHeader = $('#maps-feed').find('h2');
  const $map = $('#maps-container').find('div');

  $dropdown.hide();
  $registerDiv.hide();
  $mapInfoDiv.hide();
  $newMapContainer.hide();
  $('#error-message').hide();

  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched

  $profileButton.click(function(event) {
    event.preventDefault();

    $.post('/')
      .then(() => {
        if ($mapInfoDiv.is(':visible')) {
          $mapInfoDiv.hide();
        };

        if ($newMapContainer.is(':visible')) {
          cancelMap(event, $newMapContainer);
        };

        if ($dropdown.is(':hidden')) {
          $dropdown.slideDown();
        } else {
          $dropdown.hide();
        };
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
          $registerForm.find('input').val('');
        };
      });
  });

  $createButton.click(function(event) {
    event.preventDefault();

    $.post('/')
      .then(() => {
        if ($dropdown.is(':visible')) {
          $dropdown.hide();
        };

        if ($newMapContainer.is(":visible")) {
          $mapInfoDiv.hide();
          cancelMap(event, $newMapContainer);
        };

        if ($mapInfoDiv.is(":hidden")) {
          $nameInput.val('');
          $mapInfoDiv.fadeIn();
        } else {
          $mapInfoDiv.hide();
        };
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
          $registerForm.find('input').val('');
        }
      });
  });

  $mapForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    const mapName = $('#map-form input:nth-child(1)').val().trim();
    const mapCity = $('#map-form input:nth-child(2)').val().trim();

    $.get('/api/maps/user/:user', function(data) {
      let mapNames = [];
      data.forEach(map => mapNames.push(map.name))
      console.log(mapNames)

      if (!mapName || !mapCity) {
        $('#error-message').addClass('map-name-error');
        $('#error-message').find('p').html('Please enter a valid name and city.');
        $('#error-message').slideDown(300);
      } else if (mapNames.includes(mapName)) {
        $('#error-message').addClass('map-name-error');
        $('#error-message').find('p').html('Map name already exists. Please enter a new one.');
        $('#error-message').slideDown(300);
      } else {
        $mapInfoDiv.hide();
        $('#error-maps').hide()
        createNewMap($mapForm, $newMapContainer); // hide the map name submission container, show new map container
      }
    })
  })

  $(document).mouseup(function(e){
    let errorMaps = $("#error-message");
    // If the target of the click isn't the container
    if (!errorMaps.is(e.target) && errorMaps.has(e.target).length === 0){
        errorMaps.hide();
        errorMaps.removeClass();
        errorMaps.addClass('error-message');
    };

    if (!$newMapContainer.is(e.target) && $newMapContainer.has(e.target).length === 0 && $('#marker-container').is(':empty')) {
      cancelMap(event, $newMapContainer);
    };
  });

  $cancelCreate.click(function(event) {
    event.preventDefault();
    $mapInfoDiv.hide();
  });

  $submitMapButton.click(function() {
    if ($('#marker-container').is(':empty')) {
      $('#error-message').addClass('new-map-error');
      $('#error-message').find('p').html('Your map does not have any markers.');
      $('#error-message').slideDown(300);
    } else {
      submitMap($newMapContainer, $markerContainer);
    };
  });

  $cancelSubmit.click(function() {
    cancelMap(event, $newMapContainer);
  });

  $registerForm.submit(function(event) {
    event.preventDefault();

    const values = `email=${$registerInput.val()}`

    if ($registerInput.val().includes(' ') || !$registerInput.val().includes('@') || !$registerInput.val().includes('.com') || !$registerInput.val()) {
      $('#error-message').addClass('register-error');
      $('#error-message').find('p').html('Please enter a valid email.');
      $('#error-message').slideDown(300);
    } else {
      $.get('/users/register/all', function (data) {
        if (data.find(obj => obj.email === $registerInput.val())) {
          $('#error-message').addClass('register-error');
          $('#error-message').find('p').html('Email is already in database.');
          $('#error-message').slideDown(300);
        } else {
          $.post('/users/register/', values);
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
        }
      })
    }

  });

  $cancelRegister.click(function(event) {
    event.preventDefault();
    $registerDiv.hide();
    $registerForm.find('input').val('');
  });

  $('#maps-container').on('click', '.favorite-map', function(event) {
    event.preventDefault();
    const mapID = $(this).attr('id').slice(13);
    $.post('/')
      .then(() => {
        $.post('/api/favorites/', {mapID})
          .then(res => {
            $('#maps-container').empty();
            loadMapsFeed();
          });
      })
      .catch(() => {
        $('#map').addClass('greyscale');
        $registerDiv.fadeIn();
      })
  });

  $favorites.click(function(event) {
    event.preventDefault();
    $mapsFeedHeader.html('Favorites');
    $( "#maps-container" ).empty();
    loadFavoritesFeed();
  });

  $myMaps.click(function(event) {
    event.preventDefault();
    $mapsFeedHeader.html('My Maps');
    $( "#maps-container" ).empty();
    loadMyMaps();
  });

  google.maps.event.addDomListener(window, 'load', function() {
    $('#maps-container').on( 'click', '.map', function() {
      $('#map').removeClass('greyscale');
      $registerDiv.hide();
      $mapInfoDiv.hide();
      $dropdown.hide();
      const mapID = $(this).attr('id').slice(4);
      showMap(mapID);
    });
  });

  $('.home').click(function(event) {
    event.preventDefault();
    $mapsFeedHeader.html('Maps');
    $('#maps-container').empty();
    loadMapsFeed();
  })
});
