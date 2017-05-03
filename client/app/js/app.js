angular.module('d3Module', []).factory('d3', [
  function(){

    var d3;
    d3 = window.d3;
    //console.log(d3);

    // returning our service so it can be used
    return d3;
}]);
 angular.module('MyApp', ['ngMaterial', 'main', 'drop-ng', 'ngMessages', 'd3Module'])
     .config(function($mdIconProvider, $mdThemingProvider) {

         $mdIconProvider.icon('share', '../assets/svg/share.svg', 24)
             .icon("menu", "../assets/svg/menu.svg", 24)
             .icon("google_plus", "../assets/svg/google-plus-box.svg", 24)
             .icon("twitter", "../assets/svg/twitter-box.svg", 24)
             .icon("facebook", "../assets/svg/facebook-box.svg", 24)
             .icon("thumbsup", "../assets/svg/thumb-up.svg", 24)
             .icon("thumbsdown", "../assets/svg/thumb-down.svg", 24)
             .icon("close", "../assets/svg/close.svg", 24)
             .icon("comment", "../assets/svg/comment-text.svg", 24);

         $mdThemingProvider.theme('default')
             .primaryPalette('blue')
             .accentPalette('red');


     }).filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
