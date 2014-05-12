/**
 * Gruntfile.js
 * (c) 2013 Michael Dominice
 * Gruntfile.js is freely distributable under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var testBaseUrl =
            'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>',
        testPath = '/test/test.html?jquery=',
        banner = [
            '/**',
            ' * <%= pkg.name %> <%= pkg.version %>',
            ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
            ' * <%= pkg.name %> is freely distributable under the MIT license.',
            ' */\n'
        ].join('\n'),
        jQueryVersions = ['2.1.1', '2.0.3', '1.10.2', '1.9.1', '1.8.3', '1.7.2'];

    function createTestUrlForJQueryVersion(version) {
        return testBaseUrl + testPath + version;
    }

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        qunit : {
            all : {
                options : {
                    urls : jQueryVersions.map(createTestUrlForJQueryVersion)
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
            all : [
                'Gruntfile.js',
                'lib/jquery.midikeys.js',
                'test/test.js',
                'test/jquery-loader.js'
            ]
        },
        bower : {
            install : {
                options : {
                    targetDir : 'components',
                    cleanTargetDir : true
                }
            }
        },
        connect : {
            server : {
                options : {
                    port : 8085,
                    hostname : 'localhost'
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
