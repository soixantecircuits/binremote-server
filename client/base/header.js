Template.header.rendered = function() {
  setTimeout(function(){
    $('#preloader').fadeOut();
    $('footer').addClass("animated fadeIn");
  }, 100) ;
};