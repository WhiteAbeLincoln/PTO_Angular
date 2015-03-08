/**
 * Created by abe on 3/7/15.
 */
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
            },
            {
                name: 'Volunteer',
                url: '/volunteer',
                type: 'link'
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
            }],

        admin: [{       //sample link
            name: 'Add Download',
            url: 'admin/download',
            type: 'link'
        }, {       //sample link
            name: 'Members',
            url: '/admin/members',
            type: 'link'
        }]

    });
