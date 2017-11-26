var App = {}

App.init = function(){
  AOS.init();
  App.setupTooltips();
  App.setupArrows();
}

App.setupArrows = function() {
  pentitle="SCSS Arrow Animation";
}

App.setupTooltips = function() {
  $('[data-toggle="tooltip"]').tooltip();
}

$(document).ready(App.init)