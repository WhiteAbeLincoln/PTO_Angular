/**
 * Created by abe on 3/5/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', 'ICON_STYLES', '$mdDialog', function ($scope, Download, ICON_STYLES, $mdDialog) {
            $scope.updateTitle("Downloads");

            $scope.user = $scope.currentUser;
            console.log($scope.currentUser);

            $scope.iconStyles = ICON_STYLES;

            $scope.dltypes = [
                {
                    name: 'Meeting Notes',
                    downloads: [
                        {
                            fileType: 'pdf',
                            name: 'Meeting notes 12/12',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-12-20 19:30:33',
                            id: 12
                        },
                        {
                            fileType: 'word',
                            name: 'Meeting notes 12/14',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-12-19 10:30:33',
                            id: 14
                        },
                        {
                            fileType: 'document',
                            name: 'Meeting notes 11/14',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-11-01 11:30:33',
                            id: 17
                        },
                        {
                            fileType: 'excel',
                            name: 'Meeting notes 11/14',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-11-18 12:30:33',
                            id: 18
                        },
                        {
                            fileType: 'powerpoint',
                            name: 'Meeting notes 11/14',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-10-18 13:30:33',
                            id: 19
                        },
                        {
                            fileType: 'openoffice',
                            name: 'Meeting notes 11/14',
                            shortDesc: 'Created a new download page and threw a party',
                            description: 'long description',
                            modDate: '2014-11-10 14:30:33',
                            id: 20
                        }

                    ]
                },
                {
                    name: "Pictures",
                    downloads: [
                        {
                            fileType: "image",
                            name: "Birthday Cake",
                            shortDesc: "Created a new download page and threw a party",
                            description: "long description",
                            modDate: "2014-12-01 15:30:33",
                            id: "13"
                        },
                        {
                            fileType: "image",
                            name: "New Dog",
                            shortDesc: "I got a dog!",
                            description: "long description",
                            modDate: "2013-12-01 15:30:33",
                            id: "15"
                        }, {
                            fileType: "image",
                            name: "Child Cake",
                            shortDesc: "Baked in a deluxe E-Zbake oven",
                            description: "long description",
                            modDate: "2013-12-01 10:30:33",
                            id: "13"
                        }
                    ]
                }
            ];

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
