(function(){
    angular.module('myApp.controllers')
        .controller('CreateDownloadCtrl', ['$scope', 'FileReader', '$mdDialog', function($scope, FileReader, $mdDialog){
            $scope.download = {};
            $scope.pgress = [];
            $scope.download.files = [];

            //TODO: Change this to a directive element
            $scope.fileUpload = function(){
                document.getElementById('fileInput').click();
            };

            $scope.fileChange = function(){
                console.log(document.getElementById('fileInput').files);
                $scope.$apply(function(){
                    for (var i = 0; i < document.getElementById('fileInput').files.length; i++){
                        $scope.download.files.push(document.getElementById('fileInput').files[i]);
                    }
                });

                (function uploadFile (filenum){
                    var file = $scope.download.files[filenum];
                    if (file.size < 10000000) {
                        if (!$scope.download.files[filenum].data) {
                            FileReader.readAsDataUrl(file, $scope).then(function (result) {
                                $scope.download.files[filenum].data = result;
                                if (filenum + 1 < $scope.download.files.length) {
                                    uploadFile(filenum + 1);
                                }
                            }).catch(function (err) {
                                console.log(err);
                            }).finally(null, function (progress) {
                                console.log(filenum + " : " + progress + "%");

                                if (!$scope.pgress[filenum]) {
                                    $scope.pgress.push(0);
                                }
                                $scope.pgress[filenum] = Math.round(progress);
                            });
                        } else {
                            if (filenum + 1 < $scope.download.files.length) {
                                uploadFile(filenum + 1);
                            }
                        }
                    } else {
                        $scope.removeFile(filenum);
                        alert(file.name + ' is Too Large');
                    }
                })(0);

            };

            $scope.removeFile = function(index){
                $scope.download.files.splice(index, 1);
                $scope.pgress.splice(index, 1);
            };

            $scope.cancel = function(){
                $mdDialog.cancel();
            };

            $scope.submit = function(data){
                $mdDialog.hide(data);
            }

        }]);
})();
