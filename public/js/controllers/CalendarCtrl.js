/**
 * Created by abe on 6/9/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('CalendarCtrl', ['$scope', 'Calendar', '$mdDialog', '$mdToast', '$timeout', 'FileDownload', '$window',
        function($scope, Calendar, $mdDialog, $mdToast, $timeout, FileDownload, $window) {
            function getCalendar() {
                $scope.calendar = Calendar.query(function() {
                    for (var i=0; i < $scope.calendar.length; i++) {
                        $scope.calendar[i].date = moment($scope.calendar[i].date).format('YYYY/MM/DD HH:mm:ss');
                    }
                });
            }
            getCalendar();

            $scope.user = $scope.currentUser;
            $scope.headers = [
                {title:'Event Id'},
                {title:'Event Name'},
                {title:'Event Date'},
                {title:'Contact'}
            ];

            $scope.exportSelected = function(data) {
                var ids = [];
                data.forEach(function(el) {
                    if (el.$checked) {
                        ids.push(el.id);
                    }
                });

                $http.get('/api/calendar?mode=csv&ids='+ids.join(',')).then(function(data){
                    FileDownload(data.data, {filename: 'calendar.csv', mime: 'text/csv'});
                }).catch(function(err){
                    console.log(err);
                });
            };

            $scope.createEvent = function (ev) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    controller: 'CreateEventCtrl',
                    templateUrl: 'partials/admin/event.tmpl.html',
                    targetEvent: ev
                }).then(function(answer) {
                    var event = new Calendar(answer);
                    event.$save();
                    $window.location.reload();
                });

            };

            $scope.deleteSelected = function(deletedItems) {
                var message = deletedItems.length == 1 ? '1 Row Deleted' : deletedItems.length + ' Rows Deleted';

                var ids = [];
                deletedItems.forEach(function(el) {
                    if (el.$checked) {
                        ids.push(el.id);
                    }
                });

                var toast = $mdToast.simple()
                    .content(message)
                    .action('UNDO')
                    .highlightAction(true)
                    .position('bottom left')
                    .hideDelay(4000);

                var pDelete = $timeout(function(){
                    Calendar.delete({ids: ids.join(',')});
                }, 4001);

                $mdToast.show(toast).then(function(){
                    $timeout.cancel(pDelete);
                    getCalendar();
                })
            };

        }])
        .controller('CreateEventCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {
            $scope.cancel = function(){
                $mdDialog.cancel();
            };

            $scope.submit = function(data){
                $mdDialog.hide(data);
            }
        }])

})();
