// Karma configuration
// Generated on Tue Jun 24 2014 15:08:57 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
    'use strict';

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',

        // frameworks to use
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            // thurd party dependencies
            'components/jquery/dist/jquery.min.js',
            // src files
            'lib/midikeys.js',
            'lib/jquery.midikeys.js',
            // test specs
            'test/midikeys.spec.js',
            'test/jquery.midikeys.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'lib/midikeys.js' : ['coverage'],
            'lib/jquery.midikeys.js' : ['coverage']
        },

        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // start these browsers
        browsers: ['PhantomJS'],

        client: {
            mocha: {
                ui: 'tdd'
            }
        },

        coverageReporter : {
            type : 'html',
            dir : 'coverage/'
        }
    });
};
