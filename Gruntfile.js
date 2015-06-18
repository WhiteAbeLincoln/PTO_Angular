/**
 * Created by abe on 1/7/15.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                //define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                src: ['js/**/*.js'],
                dest: 'scripts/js/main.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'scripts/js/main.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'index.html'
                ],
                // ignorepath: '^/',
                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        },
        processhtml: {
            options: {

            },
            dist: {
                files: {
                    'index.html': ['index.html']
                }
            }

        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('build', ['concat', 'uglify', 'processhtml', 'wiredep']);
};