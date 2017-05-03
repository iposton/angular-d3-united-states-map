(function() {
    'use strict';
    angular.module('main')

    .config(function($sceProvider) {
        // ngMaterial $mdIconProvider will be updated  to mark urls as safe.
        // Meanwhile, disable $sce for ngMaterial CodePen Demos that using external SVGs
        $sceProvider.enabled(false);
    })

    .controller('MainController', ['mainService', '$mdDialog', 'd3', '$http', '$scope', '$timeout', MainController]);

    function MainController(mainService, $mdDialog, d3, $http, $scope, $timeout) {

      

    }
}());
