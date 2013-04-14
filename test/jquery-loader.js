/* jshint regexp:false */
(function (window) {
    'use strict';
    var path = '../components/jquery/jquery.min.js',
        jQueryVersion = window.location.search.match(/[?&]jquery=(.*?)(?=&|$)/);

    if (jQueryVersion) {
        path = '//cdnjs.cloudflare.com/ajax/libs/jquery/' + jQueryVersion[1] + '/jquery.min.js';
    }

    window.document.write('<script src="' + path + '"></script>');
}(this));
