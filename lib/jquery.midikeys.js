/**
 * jquery.midikeys.js
 * (c) 2013 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
(function (root, define, factory) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // onlyu Common-JS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else if (typeof define !== 'undefined' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals (root is window)
        return factory(root.jQuery);
    }
}(this, this.define, function ($, undefined) {
    'use strict';

    var NOTE_VALUE_C3 = 48,
        NOTE_VELOCITY_128 = 0x7f,
        NOTE_VELOCITY_64 = 0x40,
        NOTE_ON = 0x90,
        NOTE_OFF = 0x80,
        // Event constants
        EVENT_KEYDOWN = 'keydown',
        EVENT_KEYUP = 'keyup',
        // Method names
        METHOD_DESTROY = 'destroy',
        // Parameter names
        PARAM_NOTE_ON_VELOCITY = 'noteOnVelocity',
        PARAM_NOTE_OFF_VELOCITY = 'noteOffVelocity',
        PARAM_CHANNEL = 'channel',
        PARAM_START_NOTE = 'startNote',
        defaults = (function () {
            var defaults = {};
            defaults[PARAM_START_NOTE] = NOTE_VALUE_C3;
            defaults[PARAM_NOTE_ON_VELOCITY] = NOTE_VELOCITY_128;
            defaults[PARAM_NOTE_OFF_VELOCITY] = NOTE_VELOCITY_64;
            defaults[PARAM_CHANNEL] = 0;
            return defaults;
        }()),
        PARAMETERS = [
            PARAM_START_NOTE,
            PARAM_NOTE_ON_VELOCITY,
            PARAM_NOTE_OFF_VELOCITY,
            PARAM_CHANNEL
        ],
        pluginName = 'midiKeys',
        pluginDataName = '_plugin_' + pluginName,
        keys = 'ZSXDCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P',
        types = {},
        getEventCode = function (event, startNote) {
            var character = String.fromCharCode(event.keyCode),
                index = keys.indexOf(character);
            if (index < 0) {
                return;
            }
            return startNote + index;
        };

    types[NOTE_ON] = 'NOTE ON';
    types[NOTE_OFF] = 'NOTE_OFF';

    /**
     * Event class.
     */
    function MIDIEvent(timestamp, data) {
        this.timestamp = timestamp;
        this.data = data;
    }

    MIDIEvent.createData = function (status, note, velocity) {
        var data = new Uint8Array(3);
        data[0] = status;
        data[1] = note;
        data[2] = velocity;
        return data;
    };

    /**
     * Plugin class.
     */
    function MIDIKeys(element, options) {

        var plugin = this,
            events = {},
            $el = plugin.$el = $(element),
            opts = plugin.opts = $.extend({}, defaults, options),
            createEventCallback = function (status, velocity) {
                return function (event) {
                    var type = event.type,
                        eventCode = getEventCode(event, opts[PARAM_START_NOTE]),
                        eventKey = pluginName + eventCode;

                    if (!eventCode) {
                        return;
                    }

                    if (type === EVENT_KEYDOWN) {
                        if (events[eventKey]) {
                            return; // already fired, don't do it again
                        } else {
                            events[eventKey] = true;
                        }
                    } else if (type === EVENT_KEYUP) {
                        delete events[eventKey];
                    }

                    if ($.isFunction(velocity)) {
                        velocity = velocity(event.timeStamp);
                    }

                    $el.trigger('message',
                        new MIDIEvent(event.timeStamp,
                            MIDIEvent.createData(
                                status | opts[PARAM_CHANNEL], eventCode, velocity)));
                };
            },
            // save references of callback to support detachment if necessary
            keydown = createEventCallback(NOTE_ON, opts[PARAM_NOTE_ON_VELOCITY]),
            keyup = createEventCallback(NOTE_OFF, opts[PARAM_NOTE_OFF_VELOCITY]);


        plugin._defaults = defaults;

        plugin.option = function (name, value) {
            if (PARAMETERS.indexOf(name) > -1) {
                opts[name] = value;
            }
        };

        // bind events
        $el.on(EVENT_KEYDOWN, keydown);
        $el.on(EVENT_KEYUP, keyup);

        plugin[METHOD_DESTROY] = function () {
            // unbind events
            $el.off(EVENT_KEYDOWN, keydown);
            $el.off(EVENT_KEYUP, keyup);
        };

    }

    $.fn[pluginName] = function (options) {

        var args = arguments;

        if (options === undefined || typeof options === 'object') {

            return this.each(function () {

                if (!$.data(this, pluginDataName)) {
                    $.data(this, pluginDataName, new MIDIKeys(this, options));
                }

            });

        } else if (typeof options === 'string') {

            var returns;
            args = Array.prototype.slice.call(args, 1);

            this.each(function () {
                var plugin = $(this).data(pluginDataName);

                if (plugin instanceof MIDIKeys && typeof plugin[options] === 'function') {
                    returns = plugin[options].apply(plugin, args);
                }

                if (options === METHOD_DESTROY) {
                    $.data(this, pluginDataName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }

    };

    return $.fn[pluginName];

}));
