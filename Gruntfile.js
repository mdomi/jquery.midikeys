/**
 * Gruntfile.js
 * (c) 2013 Michael Dominice
 * Gruntfile.js is freely distributable under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var testUrl = 'http://localhost:<%= connect.server.options.port %>/test/test.html?jquery=',
        banner = [
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
            all : {
                options : {
                    urls : ['1.9.1'].map(function (version) {
                        return testUrl + version;
                    })
                }
            }
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
            all : ['Gruntfile.js', 'lib/jquery.midikeys.js', 'test/test.js']
        },
        bower : {
            install : {
                options : {
                    targetDir : './components',
                    cleanup : true
                }
            }
        },
        connect : {
            server : {
                options : {
                    port : 8085
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('prepare-code', ['jshint', 'uglify']);

    // Test task
    grunt.registerTask('test', ['bower:install', 'prepare-code', 'connect', 'qunit']);

    // Default tasks(s)
    grunt.registerTask('default', ['test']);


};
