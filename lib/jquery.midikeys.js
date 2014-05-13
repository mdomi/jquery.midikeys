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
        return factory(root, root.jQuery);
    }
}(this, this.define, function (window, $) {
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
        data[2] = (typeof velocity === 'function') ? velocity(event.timeStamp) : velocity;
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
                eventKey = pluginName + eventCode,
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

    /**
     * Plugin class.
     */
    function MIDIKeys(element, options) {

        var plugin = this,
            events = {},
            opts = plugin.opts = extend({}, defaults, options);

        plugin.el = element;
        // save references of callback to support detachment if necessary
        plugin._keydown = createEventCallback(NOTE_ON, opts[PARAM_NOTE_ON_VELOCITY], opts, events);
        plugin._keyup = createEventCallback(NOTE_OFF, opts[PARAM_NOTE_OFF_VELOCITY], opts, events);


        plugin._defaults = defaults;

        plugin.option = function (name, value) {
            if (PARAMETERS.indexOf(name) > -1) {
                opts[name] = value;
            }
        };

        // bind events
        element.addEventListener(EVENT_KEYDOWN, plugin._keydown);
        element.addEventListener(EVENT_KEYUP, plugin._keyup);
    }

    MIDIKeys.prototype[METHOD_DESTROY] = function () {
        // unbind events
        this.el.removeEventListener(EVENT_KEYDOWN, this._keydown);
        this.el.removeEventListener(EVENT_KEYUP, this._keyup);
    };

    $.fn[pluginName] = function (options) {

        var args = arguments;

        if (typeof options === 'undefined' || typeof options === 'object') {

            return this.each(function () {

                if (!$.data(this, pluginDataName)) {
                    $.data(this, pluginDataName, new MIDIKeys(this, options));
                }

            });

        } else if (typeof options === 'string') {

            var returns;
            args = rest(args);

            this.each(function () {
                var plugin = $(this).data(pluginDataName);

                if (plugin instanceof MIDIKeys && typeof plugin[options] === 'function') {
                    returns = plugin[options].apply(plugin, args);
                }

                if (options === METHOD_DESTROY) {
                    $.data(this, pluginDataName, null);
                }
            });

            return typeof returns !== 'undefined' ? returns : this;
        }

    };

    window.MIDIKeys = MIDIKeys;
    return $.fn[pluginName];

}));
