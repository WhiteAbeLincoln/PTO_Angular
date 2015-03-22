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
                    }
                ]
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
            }
        ],

        admin: [
            {
                name:'Me',
                url: '/admin',
                type:'link'
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
                    },
                    {
                        name: 'Service Scholarship Application',
                        url: '/admin/forms/service',
                        type: 'link'
                    },
                    {
                        name: 'Board Membership',
                        url: '/admin/forms/board',
                        type: 'link'
                    },
                    {
                        name: 'Volunteer',
                        url: '/admin/forms/volunteer',
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
