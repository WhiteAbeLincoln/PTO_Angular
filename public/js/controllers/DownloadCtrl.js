/**
 * Created by abe on 3/5/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', 'ICON_STYLES', '$mdDialog', function ($scope, Download, ICON_STYLES, $mdDialog) {
            $scope.updateTitle("Downloads");

            $scope.user = $scope.currentUser;

            $scope.iconStyles = ICON_STYLES;
            $scope.dltypes = Download.get();

            $scope.createDownload = function (ev){
                $mdDialog.show({
                    controller: 'CreateDownloadCtrl',
                    templateUrl: 'partials/admin/download.tmpl.html',
                    targetEvent: ev
                }).then(function(answer){
                    alert(JSON.stringify(answer));
                }, function(){
                    alert('cancelled');
                })
            }
        }]);
})();
