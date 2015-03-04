(function(){
    angular.module('myApp')    
    .factory('menu', ['$location', '$rootScope', '$log', function($location, $rootScope, $log){

        var sections = [{       //sample link
            name: 'News',
            url: '/news',
            type: 'link'
        }];

        //sample dropdown with sub pages -- could move this to a constant in future. see content-data.js in material docs
        sections.push({
            name: 'Forms',
            type: 'toggle', // note the type
            pages: [{
                name: 'Membership',
                url: '/forms/membership',
                type: 'link'
            },
                {
                    name: 'Scholarship Application',
                    url: '/forms/scholarship',
                    type: 'link'
                },
                {
                    name: 'Service Scholarship Application',
                    url: '/forms/service',
                    type: 'link'
                },
                {
                    name: 'Board Membership',
                    url: '/forms/board',
                    type: 'link'
                }]
        });

        sections.push(
            {
                name: 'Volunteer',
                url: '/volunteer',
                type: 'link'
            },
            {
                name:'Meet the Board',
                url: '/about-board',
                type: 'link'
            },
            {
                name:'Downloads',
                url: '/downloads',
                type: 'link'
            }
        );

        var self;

        $rootScope.$on('$locationChangeSuccess', onLocationChange);

        return self = {
            sections: sections,
            selectSection: function(section){
                self.openedSection = section;
            },
            toggleSelectSection: function(section) {
                self.openedSection = (self.openedSection === section ? null : section);
            },
            isSectionSelected: function(section){
                return self.openedSection === section;
            },
            selectPage: function(section, page){
                page && page.url && $location.path(page.url);
                self.currentSection = section;
                self.currentPage = page;
                //$log.debug('current page: '+ self.currentPage.name);
            },
            isPageSelected: function(page){
                //$log.debug('selected page ' + page.name);
                return self.currentPage === page;
            }
        };

        function onLocationChange() {
            var path = $location.path();

            var matchPage = function (section, page) {
              if (path === page.url){
                  self.selectSection(section);
                  self.selectPage(section, page);
              }
            };

            sections.forEach(function(section) {
                //if (section.children) -- not needed, since we don't have any headers
                if (section.pages) { //matches top-level toggles, like Forms
                    section.pages.forEach(function (page) {
                        matchPage(section, page);
                    });
                } else if (section.type === 'link') {
                    matchPage(section, section);
                }
            });
        }
    }]);
})()
