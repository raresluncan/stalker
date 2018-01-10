App.users = {}

App.users.init = function() {
  App.users.getAllUsers();
  App.users.changeUserAdminSetup();
  App.users.setupSubmitUser();
}

App.users.getAllUsers = function() {
  $.ajax({
    url: $('.users-table').data('get-users'),
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
    },
    success: function(data) {
      App.users.buildUsersTable(data);
    },
    error: function(data) {
      alert('Getting users failed');
    }
  });
}

App.users.getIsAdminCheckbox = function(isAdmin, userId) {
  var $input = $('<input>');
  $input.addClass('is-admin-checkbox');
  $input.attr('type', 'checkbox');
  $input.data('user-id', userId);

  if (isAdmin) {
    $input.attr('checked', '');
  }

  return $input;
}

App.users.generateTableRowWithInfo = function(userData) {
  var userObject = userData.fields;
  var $nameTableData = $('<div>').addClass("app-table-data col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2");
  var $emailTableData = $('<div>').addClass("app-table-data col-xs-4 col-sm-4 col-md-3 col-lg-4 col-xl-4");
  var $addressTableData = $('<div>').addClass("app-table-data col-xs-2 col-sm-2 col-md-2 col-lg-3 col-xl-3");
  var $superAdminTableData = $('<div>').addClass("app-table-data text-center col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2");
  var $detailsTableData = $('<div>').addClass("app-table-data col-xs-1 col-sm-1 col-md-2 col-lg-1 col-xl-1");

  var $tableRow = $('<div>').addClass('row app-table-content');
  $tableRow.attr('data-user-id', userData.pk);
  $nameTableData.append(userObject.name);
  $emailTableData.append(userObject.email);
  $addressTableData.append(userObject.address);
  $superAdminTableData.append(App.users.getIsAdminCheckbox(
    userObject.is_super_admin,
    userData.pk,
  ));
  $detailsTableData.append('details_here');


  $tableRow.append($nameTableData);
  $tableRow.append($emailTableData);
  $tableRow.append($addressTableData);
  $tableRow.append($superAdminTableData);
  $tableRow.append($detailsTableData);

  $('.users-table').append($tableRow);

}

App.users.buildUsersTable = function(data) {
  var index;
  var dataLength = data.length;
  for ( index=0; index < dataLength; index++ ) {
    App.users.generateTableRowWithInfo(data[index]);
  }
}

App.users.changeUserAdminSetup = function() {
  $('.table-container').on('click', function(e) {
    $('.is-admin-checkbox').on('change', function(e){
      var userId = $(e.target).closest('.row.app-table-content')
        .data('user-id');
      var url = $(e.target).closest('.app-table').data('change-user-admin');
      var sendData = {}
      sendData['user_id'] = JSON.stringify(userId);
      $.ajax({
        url: url,
        type: 'POST',
        data: sendData,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
        },
        success: function(data) {

        },
        error: function(data) {
          alert('Changing admin status failed.');
        }
      });
    });
  });
}

App.users.setupSubmitUser = function() {
  $('.submit-new-user').on('click', function(e) {
    var $modal = $(e.target).closest('.modal');
    var $newUserForm = $(e.target).closest('.modal-content').find('.new-user-form');
    $.ajax({
      url: login_url,
      type: 'POST',
      contentType: "App.homelication/x-www-form-urlencoded;charset=utf-8",
      data: $newUserForm.serializeArray(),
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
      },
      success: function(data) {

      }
      },
      error: function(data) {
        App.generateNotify('Invalid username or passowrd!', "danger", 1500);
      }
    });
  });
}



$(document).ready(App.users.init)