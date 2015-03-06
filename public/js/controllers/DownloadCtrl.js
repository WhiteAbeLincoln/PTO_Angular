/**
 * Created by abe on 3/5/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', function ($scope, Download) {
            $scope.dltypes = [
                {
                    name:"Meeting Notes",
                    downloads: [
                        {
                            get fileIcon() {
                                return "img/icons/file-"+this.fileType+"-box.svg"
                            },
                            fileType:"pdf",
                            name:"Meeting notes 12/12",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"12"
                        },
                        {
                            get fileIcon() {
                                return "img/icons/file-"+this.fileType+"-box.svg"
                            },
                            fileType:"pdf",
                            name:"Meeting notes 12/14",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2014-12-01 15:30:33",
                            id:"14"
                        },
                        {
                            get fileIcon() {
                                return "img/icons/file-"+this.fileType+"-box.svg"
                            },
                            fileType:"document",
                            name:"Meeting notes 11/14",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-11-01 15:30:33",
                            id:"17"
                        }

                    ]
                },
                {
                    name:"Pictures",
                    downloads: [
                        {
                            get fileIcon() {
                                return "img/icons/file-"+this.fileType+"-box.svg"
                            },
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
                            get fileIcon() {
                                return "img/icons/file-"+this.fileType+"-box.svg"
                            },
                            fileType:"image",
                            name:"New Dog",
                            shortDesc:"I got a dog!",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"15"
                        }
                    ]
                }
            ];
        }]);
})();
