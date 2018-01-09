App.login = {};

App.login.init = function() {
  App.login.setupLoginButton();
}

App.login.setupLoginButton = function() {
  $('.login-submit .btn').on('click', function(e) {
    App.login.attemptLogin($(this).closest('.login-form'), $(this).data('request'));
  })
}

App.login.generateLoginFormErrors = function($loginForm, responseErrors) {

}

App.login.attemptLogin = function($loginForm, login_url) {
  debugger;
  $.ajax({
      url: login_url,
      type: 'POST',
      contentType: "App.homelication/x-www-form-urlencoded;charset=utf-8",
      data: $loginForm.serializeArray(),
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
      },
      success: function(data) {
        if (data.success == true) { window.location.replace("/"); }
      },
      error: function(data) {
        App.login.generateLoginFormErrors();
      }
    });
}

$(document).ready(App.login.init);