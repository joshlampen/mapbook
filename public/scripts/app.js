$(document).ready(function() {
  loadMap(); // load empty google map

  const $createButton = $('#create');
  const $profileButton = $('#profile');
  const $dropdown = $('#dropdown');

  const $registerDiv = $('#register');
  const $registerForm = $registerDiv.find('#register-form');
  const $cancelRegister = $registerDiv.find('a');

  const $mapInfoDiv = $('#enter-map-info'); // for submitting map name and city
  const $mapForm = $mapInfoDiv.find('#map-form');
  const $nameInput = $mapForm.find('input');
  const $cancelCreate = $mapInfoDiv.find('a');

  const $newMapContainer = $('#new-map'); // appears following map name submission
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

  loadMapsFeed(); // loads all maps in the database to the feed
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

  $mapForm.submit(function(event) { // called upon submission of map name and city
    event.preventDefault();
    const mapName = $('#map-form input:nth-child(1)').val().trim();
    const mapCity = $('#map-form input:nth-child(2)').val().trim();

    $.get('/api/maps/user', function(data) {
      let mapNames = [];
      data.forEach(map => mapNames.push(map.name))

      if (!mapName || !mapCity) {
        $('#error-message').addClass('map-name-error');
        $('#error-message').find('p').html('Please enter a valid name and city.');
        $('#error-message').slideDown(300);
      } else if (mapNames.includes(mapName)) {
        $('#error-message').addClass('map-name-error');
        $('#error-message').find('p').html('Map name already exists. Please enter a new one.');
        $('#error-message').slideDown(300);
      } else {
        loadMap();
        $mapInfoDiv.hide();
        $('#error-message').hide()
        createNewMap($mapForm, $newMapContainer);
      }
    })
  })

  $(document).mouseup(function(e) {
    let errorMaps = $("#error-message");
    // If the target of the click isn't the container...
    if (!errorMaps.is(e.target) && errorMaps.has(e.target).length === 0){
        errorMaps.hide();
        errorMaps.removeClass();
        errorMaps.addClass('error-message');
    };
  });

  $cancelCreate.click(function(event) {
    event.preventDefault();
    $mapInfoDiv.hide();
    $('#error-message').hide()
  });

  $submitMapButton.click(function() {
    if ($('#marker-container').is(':empty')) {
      $('#error-message').addClass('new-map-error');
      $('#error-message').find('p').html('Your map does not have any markers.');
      $('#error-message').slideDown(300);
    } else {
      submitMap($newMapContainer, $markerContainer);
      $('#error-message').hide()
    };
  });

  $cancelSubmit.click(function() {
    cancelMap(event, $newMapContainer);
    $('#error-message').hide()
  });

  $registerForm.submit(function(event) {
    event.preventDefault();

    const userName = $registerDiv.find('#user-name').serialize().slice(5);
    const email = $registerDiv.find('#email').serialize().slice(6).replace('%40', '@');

    const values = $registerForm.serialize();

    if (userName.length < 1 || email.length < 1 || !email.includes('@') || !email.includes('.com')) {
      $('#error-message').addClass('register-error');
      $('#error-message').find('p').html('Please enter a valid name and email.');
      $('#error-message').slideDown(300);
    } else {
      $.get('/users/register/', function(data) {
        if (data.find(obj => obj.email === email)) {
          $('#error-message').addClass('register-error');
          $('#error-message').find('p').html('Email is already in database.');
          $('#error-message').slideDown(300);
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
          $('#error-message').hide();
          $.post('/users/register/', values);
        }
      })
    }

  });

  $cancelRegister.click(function(event) {
    event.preventDefault();
    $('#map').removeClass('greyscale');
    $registerDiv.hide();
    $registerForm.find('input').val('');
    $('#error-message').hide()
  });

  $('#maps-container').on('click', '.favorite-map', function(event) { // called when heart icon is pressed
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
    $('#dropdown').hide();
    $mapsFeedHeader.html('Favorites');
    $( "#maps-container" ).empty();
    loadFavoritesFeed();
  });

  $myMaps.click(function(event) {
    event.preventDefault();
    $('#dropdown').hide();
    $mapsFeedHeader.html('My Maps');
    $( "#maps-container" ).empty();
    loadMyMaps();
  });

  google.maps.event.addDomListener(window, 'load', function() {
    $('#maps-container').on( 'click', '.map', function() {
      $('#map').removeClass('greyscale');
      $registerDiv.hide();
      $registerForm.find('input').val('');
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
