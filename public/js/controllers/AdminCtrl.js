/**
 * Created by abe on 3/19/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('AdminCtrl', ['$scope', 'AuthService', '$mdDialog', '$http', '$window', function($scope, AuthService, $mdDialog, $http, $window) {
            $scope.updateTitle("Admin Tools");
            $scope.edit = false;

            $scope.logout = function() {
                AuthService.logout();
            };

            function initScope() {
                $scope.user = {};
                $scope.user.firstName = $scope.getCurrentUser().firstName;
                $scope.user.lastName = $scope.getCurrentUser().lastName;
                $scope.user.email = $scope.getCurrentUser().email;
                $scope.putObj = {};
            }
            initScope();

            $scope.$watch('user', function(newVal, oldVal) {
                angular.forEach(newVal, function(value, key) {
                    if (value !== oldVal[key]) {
                        $scope.putObj[key] = value;
                    }
                });
            }, true);

            $scope.changePassword = function(ev) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                        $scope.cancel = function(){
                            $mdDialog.cancel();
                        };

                        $scope.submit = function(data){
                            $mdDialog.hide(data);
                        }
                    }],
                    templateUrl: 'partials/admin/changepw.tmpl.html',
                    targetEvent: ev
                }).then(function(answer) {
                    $scope.putObj.password = answer;
                });
            };

            $scope.cancel = function() {
                initScope();
                $scope.edit = false;
            };

            $scope.setEdit = function() {
                $scope.edit = true;
            };

            $scope.isEmpty = function(obj) {
                return !Object.keys(obj).length;
            };

            $scope.deleteAccount = function(ev) {
                var confirm = $mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .title('Are you sure?')
                    .content('Would you like to delete your account?')
                    .ariaLabel('Delete Account?')
                    .ok('Yes')
                    .cancel('No')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(function() {
                    $http.delete('/api/admin/me').then(function(data) {
                        AuthService.logout();
                    }, function(err) {
                        console.log(err);
                    });
                })

            };

            $scope.submit = function() {
                $http.put('/api/admin/me', $scope.putObj).then(function(data) {
                    if ($scope.putObj.password) {
                        AuthService.logout();
                    } else {
                        $window.location.reload();
                    }
                }, function(err) {
                    console.log(err);
                });
            };

            $scope.accountAge = moment($scope.currentUser.registrationDate).fromNow(true);

        }])
})();
