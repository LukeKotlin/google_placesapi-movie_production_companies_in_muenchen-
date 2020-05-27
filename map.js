var map;
//var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
//var labelIndex = 0;
var infowindow;
var gmarkers = [];


function initMap() {
  // Create the map.
  var muenchen = {
    lat: 48.1351,
    lng: 11.5820
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: muenchen,
    zoom: 12
  });
  infowindow = new google.maps.InfoWindow();

  // Create the places service.
  var service = new google.maps.places.PlacesService(map);
  var getNextPage = null;
  var moreButton = document.getElementById('more');
  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) getNextPage();
  };


  // Perform a nearby search.
  service.nearbySearch({
      location: muenchen,
      radius: 10000,
      keyword: ['film']
    },
    function(results, status, pagination) {
      if (status !== 'OK') return;

      createMarkers(results);
      moreButton.disabled = !pagination.hasNextPage;
      getNextPage = pagination.hasNextPage && function() {
        pagination.nextPage();
      };
    });


}





function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');


  for (var i = 0, place; place = places[i]; i++) {


    var image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      //label: labels[labelIndex++ % labels.length],
      map: map,
      place_id: place.place_id,
      title: place.name,
      position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function(e) {
      //display place details in info window
      var request = {
        placeId: this.place_id,
        fields: ['photos', 'name', 'rating', 'formatted_address', 'place_id', 'geometry', 'website', 'url', 'vicinity']
      };
      window.location.href = '#map';


      var service = new google.maps.places.PlacesService(map);
      var that = this;
      service.getDetails(request, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          place.vicinity + '<br>' + 'Google Bewertung: ' + place.rating + '/5 Sterne' + '<br><a target="_blank" href="'+place.website+'">'+place.website+'</a><br><a target="_blank" href="'+place.url+'">'+ 'In Google Maps ansehen' +'</a></div>');
          infowindow.open(map, that);
        }
      });
    });
    gmarkers.push(marker);
    
	var side_bar_html = "<div class='element'>["+gmarkers.length+"] <a class='list' href='javascript:google.maps.event.trigger(gmarkers["+parseInt(gmarkers.length-1)+ "],\"click\");'>"+place.name+"</a><br>" +
  place.vicinity  +"</div>";
	document.getElementById('side_bar').innerHTML += side_bar_html;


    var li = document.createElement('li');
    li.textContent = place.name;
    placesList.appendChild(li);


   

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}








