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
        App.generateNotify('Your account was created!', "success", 1500);
      },
      error: function(data) {
        debugger;
        var errors = jQuery.parseJSON(data.responseJSON.errors)
        $signUpForm.find('.form-group').each(function(index, element){
          App.formErrorsOrSuccess(
            $(element),
            errors,
          );
        });
        App.generateNotify('Some errors occured!', "danger", 1500);
      }
    });
}

$(document).ready(App.signUp.init);