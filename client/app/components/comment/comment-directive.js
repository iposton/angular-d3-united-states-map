(function() {
    "use strict";

    angular
        .module("main")
        .directive("comment", function() {
            return {
                templateUrl: "components/comment/comment.html",
                controller: commentCtrl,
                controllerAs: "comCtrl"
            }

            function commentCtrl($mdPanel, $http, $mdToast, $scope) {

                var self = this;

                self.showPanel = showPanel;

                function showPanel($event) {
                    
                    var position = $mdPanel.newPanelPosition()
                        .absolute()
                        .left('50%')
                        .top('50%');

                    var panelAnimation = $mdPanel.newPanelAnimation().withAnimation($mdPanel.animation.SLIDE);


                    panelAnimation.openFrom({
                        top: document.documentElement.clientHeight / 2 - 5,
                        left: document.documentElement.clientWidth
                    });

                    var config = {
                        attachTo: angular.element(document.body),
                        animation: panelAnimation,
                        controller: PanelDialogCtrl,
                        controllerAs: 'vm',
                        disableParentScroll: this.disableParentScroll,
                        templateUrl: 'components/comment/comment-panel.html',
                        hasBackdrop: true,
                        panelClass: 'comment',
                        position: position,
                        trapFocus: true,
                        zIndex: 150,
                        clickOutsideToClose: true,
                        escapeToClose: true,
                        focusOnOpen: true
                    };

                    $mdPanel.open(config);
                };

                function PanelDialogCtrl(mdPanelRef) {
                    var self = this;

                    self.sendComment = sendComment;
                    self.mail = null;
                    self.serverMessage = null;
                    self.isLoading = false;
                    self.mdPanel = mdPanelRef;
                    self.closeDialog = closeDialog;

                    function sendComment(mail) {
                        
                        self.mail = mail;
                        self.isLoading = true;

                        // SENDING COMMENT TO THE SERVER
                        $http.post('/sendmail', {
                            from: 'Ian <ianposton@sbcglobal.net>',
                            to: 'ianposton@sbcglobal.net',
                            subject: 'Comment from MyLessons',
                            text: self.mail.comment
                        }).then(res => {
                            self.isLoading = false;
                            self.serverMessage = 'Your comment was sent successfully.';
                            self.mdPanel.close();
                            
                            $scope.$emit('commentSent', self.serverMessage);

                        });

                    }

                    function closeDialog() {
                        self.mdPanel.close();
                    }
                }



            }
        })
}());
