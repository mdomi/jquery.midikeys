/**
 * jquery.midikeys.js
 * (c) 2014 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
(function (window, $, MIDIKeys) {
    'use strict';

    var PLUGIN_NAME = 'midiKeys',
        PLUGIN_DATA_NAME = '_plugin_' + PLUGIN_NAME,
        METHOD_DESTROY = 'destroy';

    function rest(array) {
        return Array.prototype.slice.call(array, 1);
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    $.fn[PLUGIN_NAME] = function (options) {
        var args = arguments;

        if (isUndefined(options) || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, PLUGIN_DATA_NAME)) {
                    $.data(this, PLUGIN_DATA_NAME, new MIDIKeys(this, options));
                }
            });
        } else if (typeof options === 'string') {
            var returns;

            this.each(function () {
                var plugin = $(this).data(PLUGIN_DATA_NAME);

                if (plugin instanceof MIDIKeys && typeof plugin[options] === 'function') {
                    returns = plugin[options].apply(plugin, rest(args));
                }

                if (options === METHOD_DESTROY) {
                    $.data(this, PLUGIN_DATA_NAME, null);
                }
            });

            return isUndefined(returns) ? this : returns;
        }
    };

}(this, this.jQuery, this.MIDIKeys));
