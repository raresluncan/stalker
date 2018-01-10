App.maps = {}

App.maps.MAPS_URL = '/maps/';
App.maps.USERS_URL = '/users/';

App.maps.init = function() {
  App.maps.setupMap();
  App.maps.setupMapControls();
  App.maps.setupSelect();
  App.maps.setupSelectEvent();
  App.maps.getAllUsers();
}

App.maps.setupSelect = function() {
  $('.select-user-map').select2({
    placeholder: "View user tracks",
    multiple: true,
    width: 300,
  });
}

App.maps.getOwnCoordinates = function(url) {
  $.ajax({
    url: url,
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
    },
    success: function(data) {
      var dataObject = jQuery.parseJSON(data.data);
      App.maps.showMapWithLocations(dataObject);
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
      zoom: 13,
      gestureHandling: 'greedy',
  };

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var index, markerPosition, date, info;
  for (index=0; index < dataLength; index++ ) {
    info = data[index].fields;
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
          + date.toDateString() +" at " + date.toTimeString()
    });

    google.maps.event.addListener(marker, "click", function (e) {
        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(marker.title);
        infoWindow.open(map, marker);
    });
  }
  App.replaceLoader($('.loader-container'), $('.map-container'));
  $('.map-container').show();
  $('.map-controls').show();
  google.maps.event.trigger(map, 'resize');
  map.setCenter(center);
  App.generateNotify('Locations loaded sucessfuly!', "success", 1500);

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
    App.maps.getOwnCoordinates($(e.target).data('get-locations-url'));
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
          App.generateNotify('Your current position was saved!', "success", 1500);
        },
        error: function(data) {
          App.generateNotify('Marking your lcoation failed!', "danger", 1500);
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
       $('.select-user-map').val(null).trigger("change");

       App.generateNotify('Your current position loaded!', "success", 1500);

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

App.maps.generateSelectOption = function($select, userData) {
  var $option = $('<option>')
  $option.attr('value', userData.pk);
  $option.append(userData.fields.name);
  $select.append($option);
}

App.maps.buildUsersSelect = function(data) {
  var dataLength = data.length;
  var index;
  var $select = $('.select-user-map')
  for (index=0; index < dataLength; index++) {
    App.maps.generateSelectOption($select, data[index]);
  }
}

App.maps.getViewAsNotify = function(userName, userId) {
  var $container = $('<div>').addClass('container-fluid view-as-notifier');
  var $alert = $('<div>').addClass('alert alert-success text-center');
  var text = "You are viewing coordinates for <a href='" + App.maps.USERS_URL
    + "'>"+ userName + "</a>."
    + "You can revert to own coordinates <a href='" + App.maps.MAPS_URL
    +"'>here</a>."
  $alert.append(text);
  $container.append($alert);

  return $container;
}

App.maps.getNoCoordinatesMessage = function (userName, userId) {
  var $container = $('<div>').addClass('container-fluid no-coordinates');
  var $alert = $('<div>').addClass('alert alert-warning');
  var $alertText = $('<div>').addClass('alert-text text-center');
  $alertText.append("There are no coordinates registered yet!");
  $alert.append($alertText);
  $container.append($alert);

  return $container;
}

App.maps.viewCoordinatesForUser = function(data) {
  var user = data.user;
  var dataObject = jQuery.parseJSON(data.data);
  if (dataObject.length == 0) {
    $('.map-container').replaceWith(
      App.maps.getNoCoordinatesMessage(user.name, null)
    );
  } else {
    App.maps.showMapWithLocations(dataObject);
  }
  $('.map-controls').hide();
  $('.map-controls').replaceWith(App.maps.getViewAsNotify(
    user.name,
    data.pk,
  ));
  App.generateNotify('Coordinates uploaded successfully!', "success", 1500);
}

App.maps.setupSelectEvent = function() {
  $('.select-user-map').on('select2:select', function (e) {
    var sendData = {}
    var $select = $(this);
    sendData['user_id'] = JSON.stringify($select.val());
    $.ajax({
      url: $select.data('get-user-map'),
      type: 'GET',
      dataType: "json",
      data:  sendData,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
      },
      success: function(data) {
        $select.val(null).trigger('change')
        App.maps.viewCoordinatesForUser(data);
      },
      error: function(data) {
        $select.val(null).trigger('change');
        App.generateNotify('Coordinates failed to upload successfully!', "danger", 1500);
      }
    });
  });
}

App.maps.getAllUsers = function() {
  $.ajax({
    url: $('.select-user-map').data('get-users'),
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
    },
    success: function(data) {
      App.maps.buildUsersSelect(data);
    },
    error: function(data) {
      App.generateNotify('Getting users failed', "danger", 1500);
    }
  });
}

function initMap() {
  App.maps.init();
}

