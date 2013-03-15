/**
 * Gruntfile.js
 * (c) 2013 Michael Dominice
 * Gruntfile.js is freely distributable under the MIT license.
 */
/* global module:false */
module.exports = function (grunt) {
    'use strict';

    var banner = [
        '/**',
        ' * <%= pkg.name %>',
        ' * (c) 2013 <%= pkg.author %>',
        ' * <%= pkg.name %> is freely distributable under the MIT license.',
        ' */'
    ].join('\n');

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : banner
            },
            build : {
                src : 'jquery.keys.js',
                dest : 'jquery.keys.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default tasks(s)
    grunt.registerTask('default', ['uglify']);
};