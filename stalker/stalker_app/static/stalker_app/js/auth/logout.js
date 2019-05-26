App.logout = {}

App.logout.init = function() {
  App.logout.setupLogoutButton();
}

App.logout.setupLogoutButton = function() {
  $('.logout-button').on('click', function(e) {
    e.preventDefault();
    $.ajax({
        url: $(e.target).data('logout-url'),
        type: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
        },
        success: function(data) {
          window.location.replace("/")
        },
        error: function(data) {
          alert('Logout failed for reason: ' + data.error )
        }
      });
  })
}

$(document).ready(App.logout.init);