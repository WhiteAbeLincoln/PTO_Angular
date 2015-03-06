(function(){
angular.module('myApp.controllers', ['ngResource', 'ngMessages'])

    .factory('Member', ['$resource', function($resource){
           return $resource('/api/members/:id');
    }])
	
	.factory('Scholar', ['$resource', function($resource){
           return $resource('/api/scholars/:id');
    }])
	
	.factory('Service', ['$resource', function($resource){
           return $resource('/api/service/:id');
    }])
	
	.factory('Board', ['$resource', function($resource){
           return $resource('/api/board/:id');
    }])

    .factory('Download', ['$resource', function($resource){
        return $resource('/api/download/:id');
    }])

    .controller('AppCtrl', ['$scope', '$rootScope', '$mdSidenav', '$log', '$location', 'menu', function($scope, $rootScope, $mdSidenav, $log, $location, menu) {
        /*$scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function () {
                    $log.debug("toggle left done")
                });
        };*/

        $scope.menu = menu;

        $scope.path = path;
        $scope.goHome = goHome;
        $scope.openMenu = openMenu;
        $scope.closeMenu = closeMenu;
        $scope.isSectionSelected = isSectionSelected;

            $scope.social = function (url){
                window.location.href = url;
            };

        //event that occurs when $location changes the page, calls openPage() to close the menu
        $rootScope.$on('$locationChangeSuccess', openPage);

        // used by menuLink and menuToggle directives
        this.isOpen = isOpen;               //used in menuToggle directive toggle() function (app.js line 151)
        this.isSelected = isSelected;
        this.toggleOpen = toggleOpen;       //used in menuToggle directive toggle() function (app.js line 154)

        var mainContent = document.querySelector("[role='main']"); // for ARIA

        //INTERNAL METHODS

        function closeMenu() {
            $mdSidenav('left').close();
        }

        function openMenu(){
            $mdSidenav('left').open();
        }

        function path(){
            return $location.path();
        }

        function goHome($event) {
            menu.selectPage(null, null);
            $location.path('/');
        }

            //closes the menu when a page is opened (like android)
        function openPage(){
            $scope.closeMenu();
            mainContent.focus();
        }

        function isSelected(page){
            return menu.isPageSelected(page);
        }

        function isSectionSelected(section){
            var selected = false;
            var openedSection = menu.openedSection;
            if (openedSection === section){
                selected = true;
            }
            return selected;
        }

        function isOpen(section){
            return menu.isSectionSelected(section);
        }

        function toggleOpen(section){
            menu.toggleSelectSection(section);
        }

        $log.debug($scope.menu.sections);
    }]);
	
})();
