var App = {};

App.init = function(){
  AOS.init();
  App.setupTooltips();
  App.setupButtons();
}

App.setupTooltips = function() {
  $('[data-toggle="tooltip"]').tooltip();
}

App.setupButtons = function() {
  $(".login-form-container").hover(function(){
      $('.login-submit').show();
  });
}

App.getCookie = function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(
                  cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }

    return cookieValue;
}

App.formErrorsOrSuccess = function($formGroupElement, responseErrors) {
  var elementInputName = $formGroupElement.find('input, textarea, select')
    .attr('name');
  $formGroupElement.find('.help-block').remove();

  if (responseErrors[elementInputName]) {
    $formGroupElement.addClass('has-error');
    $formGroupElement.append(
      $('<div>').addClass('help-block').html(responseErrors[elementInputName])
    );
  } else {
    $formGroupElement.addClass('has-success').removeClass('has-error');
  }
}

App.replaceLoader = function($loader, $element) {
  $loader.replaceWith($element);
}

App.getLoader = function(loaderText) {
  var $container = $('<div>').addClass('container loader-container');
  var $text = $('<div>').addClass('loader-text');
  var $loader = $('<div>').addClass('loader');
  $container.append($loader);
  $text.append(loaderText);
  $container.append($text);

  return $container
}

$(document).ready(App.init);