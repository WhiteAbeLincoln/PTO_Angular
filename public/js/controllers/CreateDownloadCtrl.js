(function(){
    angular.module('myApp.controllers')
        .controller('CreateDownloadCtrl', ['$scope', 'FileReader', '$mdDialog', '$http', function($scope, FileReader, $mdDialog, $http){
            $scope.download = {};
            $scope.pgress = [];
            $scope.download.files = [];
            $scope.query = querySearch;

            $http.get('/api/downloadTypes').success(function(data){
                $scope.types = data.map(function(type){
                    return {
                        value: type.name.toLowerCase(),
                        display: type.name
                    }
                });
            });

            function querySearch (query) {
                return query ? $scope.types.filter( createFilterFor(query) ) : [1,2,3,4,5];
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(type) {
                    return (type.value.indexOf(lowercaseQuery) === 0);
                };
            }

            $scope.createType = function(){
                if ($scope.debug.typeObj){
                    $scope.download.type = $scope.debug.typeObj.display;
                    $scope.download.newType = false;
                } else {
                    $scope.download.type = $scope.debug.searchText;
                    $scope.download.newType = true;
                }
            };

            $scope.checkText = function (text){
                for (var i =0; i < $scope.types.length; i++){
                    var type = $scope.types[i];
                    if (type.value == text.toLowerCase()){
                        console.log('true');
                        $scope.download.type = type.display;
                        $scope.download.newType = false;
                        break;
                    } else {
                        console.log('false');
                        $scope.download.newType = true;
                    }
                }
            };

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
                    if (file.size < 100000000) {
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
                $scope.checkText($scope.debug.searchText);
                $mdDialog.hide(data);
            }

        }]);
})();
