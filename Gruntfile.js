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
        uglify : {
            options : {
                banner : banner,
                sourceMap : true
            },
            build : {
                files : {
                    'lib/midikeys.min.js' : ['lib/midikeys.js'],
                    'lib/jquery.midikeys.min.js' : ['lib/midikeys.js', 'lib/jquery.midikeys.js']
                }
            }
        },
        jshint : {
            options : {
                jshintrc : '.jshintrc'
            },
            src : [
                'lib/midikeys.js',
                'lib/jquery.midikeys.js'
            ],
            grunt : [
                'Gruntfile.js'
            ],
            test : [
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
        watch : {
            js : {
                files : ['lib/midikeys.js', 'lib/jquery.midikeys.js'],
                tasks : ['jshint:src', 'uglify', 'karma:watch:run']
            },
            test : {
                files : ['test/**/*.js', 'test/**/*.html'],
                tasks : ['jshint:test', 'karma:watch:run']
            }
        },
        karma : {
            options : {
                configFile : 'test/karma.conf.js'
            },
            watch : {
                background : true
            },
            continuous : {
                singleRun : true
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('prepare-code', ['jshint', 'uglify']);

    // Test task
    grunt.registerTask('test', ['bower:install', 'prepare-code', 'karma:continuous']);

    // Dev task
    grunt.registerTask('dev', ['bower:install', 'karma:watch', 'watch']);

    // Default tasks(s)
    grunt.registerTask('default', ['test']);

};
