var App = {}

App.init = function(){
  AOS.init();
  App.setupTooltips();
  App.setupButtons();
  App.setupAnimations();
}

App.setupTooltips = function() {
  $('[data-toggle="tooltip"]').tooltip();
}

App.setupButtons = function() {

  $(".login-form-container").hover(function(){
      $('.login-submit').show();
  });
}

App.setupAnimations = function() {
}

$(document).ready(App.init)