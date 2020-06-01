//Put in the get request here for the markers
//Dynamically add the script here
 /* Helper Functions */


//Issues: trying to append a new element into the head of the file as a script
//The method im trying to use is google.maps.addGeoJson
//The way im doing it is not appending to the head
//Possible Solutions:
//I found another method of adding markers, similar to how the map was set originally
//I could ask a mentor
//Functions below correspond to the latter of the two upper comments

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createScript = text => {
  const template = `
  <script type="text/javascript">
    ${text}
  </script>
  `;
  return template;
}

const renderScript = text => {
  $('head').append(createScript(text))
}

const toGeoJson = array => {
  let geoJson = {
    "type": "User destinations",
    "features": []
  }

  array.forEach(queryObj => {
    let featuresObject = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": []
      }
    }

    featuresObject.geometry.coordinates.push(queryObj.latitude);
    console.log('geojson gets called')
    featuresObject.geometry.coordinates.push(queryObj.longitude);
    geoJson.features.push(featuresObject);
  })
  return geoJson;
};

const test = (x) => {
  $('head').append(`<script>${x}</script>`)
}

$(document).ready(function () {

  $.get('/api/maps/markers', function(data) {
    alert("Got it")
  })




})
