(function() {
    "use strict";

    angular
        .module("main")
        .directive("topBar", function() {
            return {
                scope: {
                    currentuser: '=currentuser'
                },
                templateUrl: "components/top-bar/top-bar.html",
                controller: topBarCtrl,
                controllerAs: "vm"
            }

            function topBarCtrl ($mdBottomSheet, $mdSidenav, $scope) {

                var self = this;
                 
                 // Define Functions 
                self.toggleList = toggleList;
                

                 // VALUES FOR THE POPOVER ON NAV
                self.classes = 'drop-theme-arrows-bounce-dark';
                self.constrainToScrollParent = 'true';
                self.constrainToWindow = 'true';
                self.openOn = 'hover';
                self.position = 'bottom center';

                self.myWebsite = 'http://www.ianposton.com/';
                self.myRepo = 'https://github.com/iposton/angular-material-dynamic-list';

                 

                 function toggleList($event) {
                    $mdSidenav('left').toggle();
                    $mdBottomSheet.hide($event);
                }
            }
     });
}());