(function(){
    angular.module('myApp.controllers')
        .controller('CreateDownloadCtrl', ['$scope', function($scope){
            $scope.download = {};
            $scope.fileUpload = function(){
                document.getElementById('fileInput').click();
            };

            $scope.fileChange = function(){
                console.log(document.getElementById('fileInput').files);
                $scope.download.file = document.getElementById('fileInput').files[0];
                console.log($scope.download.file);
                var reader = new FileReader();

                reader.readAsBinaryString($scope.download.file);

                reader.onloadend = function(){
                    $scope.download.file.data = reader.result;
                    $scope.$apply();
                };


                $scope.$apply();
            }

        }]);
})();
