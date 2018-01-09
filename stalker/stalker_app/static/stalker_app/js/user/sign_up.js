App.signUp = {}

App.signUp.init = function() {
  App.setupSignUpButton();
}

App.setupSignUpButton = function() {
  $('.sign-up').on('click', function(e) {
    var $signUpForm = $(e.target).closest('.sign-up-content')
      .find('.sign-up-form');
    App.signUp.attemptSignUp($signUpForm, $signUpForm.data('sign-up'))
  })
}

App.signUp.attemptSignUp = function($signUpForm, signUpUrl) {
  $.ajax({
      url: signUpUrl,
      type: 'POST',
      contentType: "App.homelication/x-www-form-urlencoded;charset=utf-8",
      data: $signUpForm.serializeArray(),
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRFToken", App.getCookie('csrftoken'));
      },
      success: function(data) {
        console.log('yay new usar yyaaaaa');
      },
      error: function(data) {
        $signUpForm.find('.form-group').each(function(index, element){
          App.formErrorsOrSuccess($(element), data.errors);
        });
      }
    });
}

$(document).ready(App.signUp.init);