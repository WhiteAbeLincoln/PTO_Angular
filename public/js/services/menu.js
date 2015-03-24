(function () {
    angular.module('myApp')
        .factory('menu', ['$location', '$rootScope', '$log', function ($location, $rootScope, $log) {

            var sections = [];

            //sample dropdown with sub pages -- could move this to a constant in future. see content-data.js in material docs

            var self;

            $rootScope.$on('$locationChangeSuccess', onLocationChange);

            return self = {
                sections: sections,

                selectSection: function (section) {
                    self.openedSection = section;
                },
                toggleSelectSection: function (section) {
                    self.openedSection = (self.openedSection === section ? null : section);
                },
                isSectionSelected: function (section) {
                    return self.openedSection === section;
                },

                selectPage: function (section, page) {
                    page && page.url && $location.path(page.url);
                    self.currentSection = section;
                    self.currentPage = page;
                    //$log.debug('current page: '+ self.currentPage.name);
                },
                isPageSelected: function (page) {
                    //$log.debug('selected page ' + page.name);
                    return self.currentPage === page;
                },
                setSections: function (newSections) {
                    if (newSections != null) {
                        self.sections.length = 0;
                        newSections.forEach(function (object) {
                            self.sections.push(object);
                        });
                    }
                }
            };

            function onLocationChange() {
                var path = $location.path();

                var matchPage = function (section, page) {
                    if (path === page.url) {
                        self.selectSection(section);
                        self.selectPage(section, page);
                    }
                };

                sections.forEach(function (section) {
                    if (section.children){

                        section.children.forEach(function(childSection){
                            if (childSection.pages){
                                childSection.pages.forEach(function(page){
                                    matchPage(childSection, page);
                                });
                            }
                        });
                    }
                    else if (section.pages) { //matches top-level toggles, like Forms
                        section.pages.forEach(function (page) {
                            matchPage(section, page);
                        });
                    } else if (section.type === 'link') {
                        //matches top-level links, like News
                        matchPage(section, section);
                    }
                });
            }
        }]);
})();
