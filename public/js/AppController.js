(function(angular) {
angular.module('myApp.controllers', ['ui.gravatar', 'hc.marked'])
    .config(['markedProvider', 'gravatarServiceProvider', function(markedProvider, gravatarSP) {
        markedProvider.setOptions(
            {
                gfm: true,
                tables: true,
                sanitize: true,
                breaks: true
            }
        );

        gravatarSP.defaults = {
            size: 150,
            "default": 'retro'
        };
    }])

    .factory('Calendar', ['$resource', function($resource) {
        return $resource('/api/calendar/:id');
    }])

    .factory('Article', ['$resource', function($resource) {
        return $resource('/api/articles/:date/:slug', {slug:'@urlSlug', date: '@date'}, {
            'update': { method:'PUT' }
        });
    }])

    .factory('Member', ['$resource', function($resource){
           return $resource('/api/members/:id');
    }])

	.factory('Scholar', ['$resource', function($resource){
           return $resource('/api/scholarships/:id');
    }])

    .factory('Download', ['$resource', function($resource){
        return $resource('/api/downloads/:id');
    }])

    .controller('AppCtrl',
    ['$scope', '$rootScope', '$mdSidenav', '$log', '$location', 'menu', 'SECTIONS', 'AuthService', 'Session', '$timeout',
        function($scope, $rootScope, $mdSidenav, $log, $location, menu, SECTIONS, AuthService, Session, $timeout) {
            $scope.updateTitle = function(title) {
                $scope.pageTitle = title + " - Centerville PTO";
            };


            $scope.hideSidenav = false;
            $scope.toggleHidden = function(){
                $scope.hideSidenav = !$scope.hideSidenav;
                if ($scope.hideSidenav){
                    $scope.hiddenStyle = 'initial';
                } else {
                    $scope.hiddenStyle = '';
                }
                focusMainContent();
            };

            $scope.menu = menu;
            $scope.currentUser = null;

            $scope.path = path;
            $scope.goHome = goHome;
            $scope.openMenu = openMenu;
            $scope.closeMenu = closeMenu;
            $scope.isSectionSelected = isSectionSelected;

            $scope.href = function (url){
                window.location.href = url;
            };

            $scope.setCurrentUser = function(user){
                $scope.currentUser = user;
            };

            $scope.getCurrentUser = function(){
                return $scope.currentUser;
            };

            //user initialization
            AuthService.getUser().then(function success(res){
                $scope.setCurrentUser(res.data);
            });

            //event that occurs when $location changes the page, calls openPage() to close the menu
            $rootScope.$on('$locationChangeSuccess', function(){
                if (Session.user()){
                    $scope.menu.setSections(SECTIONS.admin);
                } else {
                    $scope.menu.setSections(SECTIONS.default);
                }

                if ($scope.path() == '/'){
                    $scope.updateTitle("Home");
                }

                openPage();
            });

            // used by menuLink and menuToggle directives
            this.isOpen = isOpen;               //used in menuToggle directive toggle() function (app.js line 151)
            this.isSelected = isSelected;
            this.toggleOpen = toggleOpen;       //used in menuToggle directive toggle() function (app.js line 154)
            this.autoFocusContent = false;

            var mainContentArea = document.querySelector("[role='main']"); // for ARIA

            //INTERNAL METHODS

            function closeMenu() {
                $timeout(function() { $mdSidenav('left').close(); });
            }

            function openMenu(){
                $timeout(function() { $mdSidenav('left').open(); });
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

                if (self.autoFocusContent) {
                    focusMainContent();
                    self.autoFocusContent = false;
                }
            }

            function focusMainContent($event) {
                if ($event) { $event.preventDefault(); }

                $timeout(function() {
                    mainContentArea.focus();
                }, 90);
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
                else if(section.children) {
                    section.children.forEach(function(childSection) {
                        if(childSection === openedSection){
                            selected = true;
                        }
                    });
                }
                return selected;
            }

            function isOpen(section){
                return menu.isSectionSelected(section);
            }

            function toggleOpen(section){
                menu.toggleSelectSection(section);
            }

            //$log.debug($scope.menu.sections);
    }])
    .controller('HomeCtrl', ['$scope', '$timeout', function($scope, $timeout){
        $timeout(function () { twttr.widgets.load(); }, 50);
    }])
    .directive('script', function() {
        return {
            restrict: 'E',
            scope: false,
            link: function(scope, elem, attr)
            {
                if (attr.type==='text/javascript-lazy')
                {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr('src');
                    if(src!==undefined)
                    {
                        s.src = src;
                    }
                    else
                    {
                        var code = elem.text();
                        s.text = code;
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
    });
	
})(window.angular);
