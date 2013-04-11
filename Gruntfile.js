/**
 * Gruntfile.js
 * (c) 2013 Michael Dominice
 * Gruntfile.js is freely distributable under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var banner = [
        '/**',
        ' * <%= pkg.name %> <%= pkg.version %>',
        ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
        ' * <%= pkg.name %> is freely distributable under the MIT license.',
        ' */\n'
    ].join('\n');

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        qunit : {
            all : ['test/**/*.html']
        },
        uglify : {
            options : {
                banner : banner
            },
            build : {
                files : {
                    'lib/jquery.midikeys.min.js' : ['lib/jquery.midikeys.js']
                }
            }
        },
        jshint : {
            options : {
                jshintrc : '.jshintrc'
            },
            all : ['Gruntfile.js', 'lib/jquery.midikeys.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Test task
    grunt.registerTask('test', ['jshint', 'uglify', 'qunit']);

    // Default tasks(s)
    grunt.registerTask('default', ['test']);


};
