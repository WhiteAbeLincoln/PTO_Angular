(function(){
    angular.module('myApp.controllers')
        .controller('CreateDownloadCtrl', ['$scope', function($scope){
            $scope.download = {};
            $scope.fileUpload = function(){
                document.getElementById('fileInput').click();
                console.log('clicked');
            };

            $scope.fileChange = function(){
                var theFiles = document.getElementById('fileInput').files;
                $scope.download.files = theFiles;
                console.log($scope.download.files);
            }
        }]);
})();
