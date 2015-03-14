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

        admin: [
        {
            name:'Create',
            type:'toggle',
            pages:[
            {       //sample link
                name: 'Download',
                url: 'admin/download',
                type: 'link'
            },
            {
                name:'News',
                url: 'admin/news',
                type: 'link'
            }]
        },
        {       //sample link
            name: 'PTO Members',
            url: '/admin/members',
            type: 'link'
        },
        {
            name: 'Board Applications',
            url: '/admin/board',
            type: 'link'
        },
        {
            name: 'Volunteers',
            url: '/admin/volunteer',
            type:'link'
        },
        {
            name: 'Scholarships',
            url: '/admin/scholarship',
            type: 'link'
        }]

    });
