App.maps = {}

App.maps.init = function() {
  App.maps.setupMap();
  App.maps.setupMapControls();
}

App.maps.getOwnCoordinates = function(url) {
  $.ajax({
    url: url,
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
    },
    success: function(data) {
      App.maps.showMapWithLocations(data);
    },
    error: function(data) {
      alert('Getting coordinats failed');
    }
  });
}

App.maps.showMapWithLocations = function(data) {
  var dataLength = data.length-1;
  var center = new google.maps.LatLng(
    data[dataLength].fields.latitude,
    data[dataLength].fields.longitude
  );

  var mapOptions = {
      center: center,
      zoom: 2,
      gestureHandling: 'greedy',
  };

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var index, markerPosition, date, info;
  for (index=0; index < dataLength; index++ ) {
    info = data[index].fields;
    // debugger;
    date = new Date(info.created_at);

    markerPosition = new google.maps.LatLng(
      data[index].fields.latitude,
      data[index].fields.longitude
    );

    var marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        title: "<div style = 'height:60px;width:200px'><b>Your location:</b>" +
          "<br />Latitude: " + info.latitude + "<br />Longitude: "
          + info.longitude + "<br />Marked on "
          // + date.prototype.toDateString() +" at " + date.prototype.toTimeString()
    });
  }
  App.replaceLoader($('.loader-container'), $('.map-container'));
  $('.map-container').show();
  $('.map-controls').show();
}

App.maps.setupMapControls = function() {
  $('.get-current-location').on('click', function(e) {
    $('.map-container').hide();
    $('.map-controls').hide();
    $('.map-content').append(App.getLoader('Loading map ...'));
    App.maps.getCurrentPosition(undefined);
  });

  $('.get-own-locations').on('click', function(e) {
    $('.map-container').hide();
    $('.map-controls').hide();
    $('.map-content').append(App.getLoader('Getting your locations ...'));
    var coordinates = App.maps.getOwnCoordinates($(e.target).data('get-locations-url'));
  });

  $('.mark-location').on('click', function(e) {
    $('.map-container').hide();
    $('.map-controls').hide();
    $('.map-content').append(App.getLoader('Saving coordinates ...'));
    $markButton = $(e.target);
    navigator.geolocation.getCurrentPosition(function (p) {
      if (navigator.geolocation){
        var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
      } else {
        alert("Browser doesn't support geolocation.");
        return;
      }

      var data = {lat: LatLng.lat(), lng: LatLng.lng()};

      $.ajax({
        url: $markButton.data('mark-location-url'),
        type: 'POST',
        data: JSON.stringify(data),
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
        },
        success: function(data) {
          $('.loader-container').remove();
          $('.map-container').show();
          $('.map-controls').show();
        },
        error: function(data) {
          alert('Mark location failed');
        }
      });
    });
  });
}

App.maps.getCurrentPosition = function(position) {
  $('.map-container').hide();
  $('.map-controls').hide();
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function (p) {
      var LatLng = position;
      if (position === undefined) {
        var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
      }
       var mapOptions = {
           center: LatLng,
           zoom: 13,
           gestureHandling: 'greedy',
       };
       var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       var marker = new google.maps.Marker({
           position: LatLng,
           map: map,
           title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
       });
       App.replaceLoader($('.loader-container'), $('.map-container'));
       $('.map-container').show();
       $('.map-controls').show();

       google.maps.event.trigger(map, 'resize');
       map.setCenter(LatLng);
       google.maps.event.addListener(marker, "click", function (e) {
           var infoWindow = new google.maps.InfoWindow();
           infoWindow.setContent(marker.title);
           infoWindow.open(map, marker);
       });
    });
  }
  else { alert("Browser doesn't support geolocation.") }
}

App.maps.setupMap = function() {
  App.maps.getCurrentPosition(undefined);
}

function initMap() {
  App.maps.init();
}

