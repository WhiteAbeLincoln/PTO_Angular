/**
 * Created by abe on 3/7/15.
 */
//TODO: Load from server, allowing for easy editing by admin
(function(angular) {
    angular.module('myApp')
        .constant('SECTIONS', {
            default: [
                {       //sample link
                    name: 'News',
                    url: '/news',
                    type: 'link'
                },
                {
                    name: 'Forms',
                    type: 'toggle', // note the type
                    pages: [
                        {
                            name: 'Membership',
                            url: '/forms/membership',
                            type: 'link'
                        },
                        {
                            name: 'Scholarship Application',
                            url: '/forms/scholarship',
                            type: 'link'
                        }
                    ]
                },
                {
                    name: 'Meet the Board',
                    url: '/about-board',
                    type: 'link'
                },
                {
                    name: 'Downloads',
                    url: '/downloads',
                    type: 'link'
                }, {
                    name: 'Calendar',
                    url: '/calendar',
                    type: 'link'
                }
            ],

            admin: [
                {
                    name: 'Me',
                    url: '/admin',
                    type: 'link'
                },
                {       //sample link
                    name: 'News',
                    url: '/news',
                    type: 'link'
                },
                {
                    name: 'Downloads',
                    url: '/downloads',
                    type: 'link'
                },
                {
                    name: 'Calendar',
                    url: '/admin/calendar',
                    type: 'link'
                },
                {
                    name: 'Applicants',
                    type: 'toggle', // note the type
                    pages: [
                        {
                            name: 'Membership',
                            url: '/admin/forms/membership',
                            type: 'link'
                        },
                        {
                            name: 'Scholarship Application',
                            url: '/admin/forms/scholarship',
                            type: 'link'
                        }
                    ]
                },
                {
                    name: 'Meet the Board',
                    url: '/about-board',
                    type: 'link'
                }
            ]

        });
})(window.angular);
