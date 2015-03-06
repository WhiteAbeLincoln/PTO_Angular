/**
 * Created by abe on 3/5/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', function ($scope, Download) {
            $scope.iconStyles = {
                pdf: {
                    color: '#DB4437',
                    height: '48px',
                    width: '48px'
                },
                document: {
                    color: '#4285f4',
                    height: '48px',
                    width: '48px'
                },
                excel: {
                    color: '#007133',
                    height: '48px',
                    width: '48px'
                },
                image: {
                    color: 'SkyBlue',
                    height: '48px',
                    width: '48px'
                },
                powerpoint: {
                    color: '#DB5A26',
                    height: '48px',
                    width: '48px'
                },
                word: {
                    color: '#2A3281',
                    height: '48px',
                    width: '48px'
                }
            };

            $scope.dltypes = [
                {
                    name:"Meeting Notes",
                    downloads: [
                        {
                            fileType:"pdf",
                            name:"Meeting notes 12/12",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"12"
                        },
                        {
                            fileType:"word",
                            name:"Meeting notes 12/14",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2014-12-01 15:30:33",
                            id:"14"
                        },
                        {
                            fileType:"document",
                            name:"Meeting notes 11/14",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-11-01 15:30:33",
                            id:"17"
                        },
                        {
                            fileType:"excel",
                            name:"Meeting notes 11/14",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-11-01 15:30:33",
                            id:"19"
                        },
                        {
                            fileType:"powerpoint",
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
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
                            fileType:"image",
                            name:"New Dog",
                            shortDesc:"I got a dog!",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"15"
                        },{
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
                            fileType:"image",
                            name:"New Dog",
                            shortDesc:"I got a dog!",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"15"
                        },{
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
                            fileType:"image",
                            name:"New Dog",
                            shortDesc:"I got a dog!",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"15"
                        },{
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
                            fileType:"image",
                            name:"New Dog",
                            shortDesc:"I got a dog!",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"15"
                        },{
                            fileType:"image",
                            name:"Birthday Cake",
                            shortDesc:"Created a new download page and threw a party",
                            description:"long description",
                            modDate:"2012-12-01 15:30:33",
                            id:"13"
                        },
                        {
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
