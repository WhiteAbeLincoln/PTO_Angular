/**
 * Created by abe on 1/7/15.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'index.html',
                    'app/views/**/*.html',   // .html support...
                    'app/views/**/*.jade',   // .jade support...
                    'app/styles/main.scss',  // .scss & .sass support...
                    'app/config.yml'         // and .yml & .yaml support out of the box!
                ],
                // ignorepath: '^/',
                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
};