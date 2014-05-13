/**
 * jquery.midikeys.js
 * (c) 2014 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
(function (window, $) {
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
        METHOD_OPTION = 'option',
        // Parameter names
        PARAM_NOTE_ON_VELOCITY = 'noteOnVelocity',
        PARAM_NOTE_OFF_VELOCITY = 'noteOffVelocity',
        PARAM_CHANNEL = 'channel',
        PARAM_START_NOTE = 'startNote',
        PARAM_CALLBACK = 'onmidimessage',
        defaults = (function () {
            var defaults = {};
            defaults[PARAM_START_NOTE] = NOTE_VALUE_C3;
            defaults[PARAM_NOTE_ON_VELOCITY] = NOTE_VELOCITY_128;
            defaults[PARAM_NOTE_OFF_VELOCITY] = NOTE_VELOCITY_64;
            defaults[PARAM_CHANNEL] = 0;
            defaults[PARAM_CALLBACK] = function () {};
            return defaults;
        }()),
        PARAMETERS = [
            PARAM_START_NOTE,
            PARAM_NOTE_ON_VELOCITY,
            PARAM_NOTE_OFF_VELOCITY,
            PARAM_CHANNEL,
            PARAM_CALLBACK
        ],
        PLUGIN_NAME = 'midiKeys',
        PLUGIN_DATA_NAME = '_plugin_' + PLUGIN_NAME,
        keys = 'ZSXDCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P',
        getEventCode = function (event, startNote) {
            var character = String.fromCharCode(event.keyCode),
                index = keys.indexOf(character);
            if (index < 0) {
                return;
            }
            return startNote + index;
        };

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    function rest(array) {
        return Array.prototype.slice.call(array, 1);
    }

    /**
     * Event class.
     */
    function MIDIEvent(timestamp, data) {
        this.timestamp = timestamp;
        this.data = data;
    }

    function createMIDIData(event, options) {
        var velocity = options.velocity,
            data = new Uint8Array(3);
        data[0] = options.status;
        data[1] = options.note;
        data[2] = isFunction(velocity) ? velocity(event.timeStamp) : velocity;
        return data;
    }

    function createMIDIEvent(event, dataOptions) {
        return new MIDIEvent(event.timeStamp, createMIDIData(event, dataOptions));
    }

    function extend(target) {
        return rest(arguments).reduce(function (dest, src) {
            if (src) {
                for (var key in src) {
                    if (src.hasOwnProperty(key)) {
                        dest[key] = src[key];
                    }
                }
            }
            return dest;
        }, target);
    }

    function createEventCallback(status, velocity, opts, events) {
        return function (event) {
            var type = event.type,
                eventCode = getEventCode(event, opts[PARAM_START_NOTE]),
                eventKey = PLUGIN_NAME + eventCode,
                dataOptions = {
                    status : status | opts[PARAM_CHANNEL],
                    note : eventCode,
                    velocity : velocity
                };

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
            opts[PARAM_CALLBACK].call(null, createMIDIEvent(event, dataOptions));
        };
    }

    function addEventListener(element, event, callback) {
        element.addEventListener(event, callback);
    }

    function removeEventListener(element, event, callback) {
        element.removeEventListener(event, callback);
    }

    /**
     * Plugin class.
     */
    function MIDIKeys(element, options) {

        var plugin = this,
            events = {},
            opts = plugin.opts = extend({}, defaults, options),
            // save references of callback to support detachment if necessary
            keydown = createEventCallback(NOTE_ON, opts[PARAM_NOTE_ON_VELOCITY], opts, events),
            keyup = createEventCallback(NOTE_OFF, opts[PARAM_NOTE_OFF_VELOCITY], opts, events);


        plugin[METHOD_OPTION] = function (name, value) {
            if (PARAMETERS.indexOf(name) > -1) {
                opts[name] = value;
            }
        };

        plugin[METHOD_DESTROY] = function () {
            // unbind events
            removeEventListener(element, EVENT_KEYDOWN, keydown);
            removeEventListener(element, EVENT_KEYUP, keyup);
        };

        // bind events
        addEventListener(element, EVENT_KEYDOWN, keydown);
        addEventListener(element, EVENT_KEYUP, keyup);
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
            args = rest(args);

            this.each(function () {
                var plugin = $(this).data(PLUGIN_DATA_NAME);

                if (plugin instanceof MIDIKeys && isFunction(plugin[options])) {
                    returns = plugin[options].apply(plugin, args);
                }

                if (options === METHOD_DESTROY) {
                    $.data(this, PLUGIN_DATA_NAME, null);
                }
            });

            return isUndefined(returns) ? this : returns;
        }

    };

    window.MIDIKeys = MIDIKeys;
    return $.fn[PLUGIN_NAME];

}(this, this.jQuery));
