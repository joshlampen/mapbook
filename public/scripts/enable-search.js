const enableSearch = function(searchBox, map) {
  // change map bounds upon location search
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  searchBox.addListener('places_changed', function() {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    };

    // for each marker that is found from search...
    markers.forEach(function(marker) {
      marker.setMap(null);
    });

    markers = [];

    // get the current bounds of the map
    const bounds = new google.maps.LatLngBounds();

    // for each place that is found...
    places.forEach(function(place) {
      if (!place.geometry) {
        return;
      };

      // create a new marker with relevant info
      markers.push(new google.maps.Marker({
        map: map,
        title: place.name,
        address: place.formatted_address,
        position: place.geometry.location
      }));

      // change the map bounds to include the marker within its view
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      };
    });

    map.fitBounds(bounds);
  });
};
