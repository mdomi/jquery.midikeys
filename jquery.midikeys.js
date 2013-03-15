/**
 * jquery.midikeys.js
 * (c) 2013 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
(function (root, define, factory) {
    'use strict';
    if (typeof define !== 'undefined' && define.amd) {
        define(['jquery'], function ($) {
            return factory($);
        });
    } else {
        return factory(root.jQuery);
    }
}(this, this.define, function ($, undefined) {
    'use strict';

    var NOTE_VALUE_C3 = 48,
        NOTE_VELOCITY_128 = 0x7f,
        NOTE_VELOCITY_64 = 0x40,
        NOTE_ON = 0x90,
        NOTE_OFF = 0x80,
        NOTES_PER_OCTAVE = 12,
        EVENT_KEYDOWN = 'keydown',
        EVENT_KEYUP = 'keyup',
        DESTROY_METHOD_NAME = 'destroy',
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        defaults = {
            startNote : NOTE_VALUE_C3,
            noteOnVelocity : NOTE_VELOCITY_128,
            noteOffVelocity : NOTE_VELOCITY_64,
            channel : 0
        },
        PARAMETERS = $.map(defaults, function (value, key) {
            return key;
        }),
        pluginName = 'midiKeys',
        pluginDataName = '_plugin_' + pluginName,
        keys = 'ZSXDCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P',
        types = {},
        createMIDIEventData = function (status, note, velocity) {
            var data = new Uint8Array(3);
            data[0] = status;
            data[1] = note;
            data[2] = velocity;
            return data;
        },
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

    function MIDIEvent(timestamp, data) {

        var event = $.extend(this, {
            timestamp : timestamp,
            data : data
        });

        event.getChannel = function () {
            return data[0] & 0x0f;
        };

        event.getVelocity = function () {
            return data[2];
        };

        event.getOctave = function () {
            return Math.floor(data[1] / NOTES_PER_OCTAVE) - 1;
        };

        event.getNoteLetter = function () {
            return notes[data[1] % NOTES_PER_OCTAVE];
        };

        event.getNote = function () {
            return this.getNoteLetter() + this.getOctave();
        };

        event.toString = function () {
            var parts = [
                'type=' + event.getType(),
                'channel=' + event.getChannel(),
                'note=' + event.getNote(),
                'velocity=' + event.getVelocity()
            ];
            return 'MIDIEvent[' + parts.join(',') + ']';
        };

        event.getType = function () {
            return types[data[0] & 0xf0];
        };
    }

    function MIDIKeys(element, options) {

        var plugin = this,
            events = {},
            $el = plugin.$el = $(element),
            opts = plugin.opts = $.extend({}, defaults, options),
            createEventCallback = function (status, velocity) {
                return function (event) {
                    var eventCode = getEventCode(event, opts.startNote),
                        eventKey = pluginName + eventCode;

                    if (!eventCode) {
                        return;
                    }

                    switch (event.type) {
                    case 'keydown':
                        if (events[eventKey]) {
                            return; // already fired, don't do it again
                        } else {
                            events[eventKey] = true;
                        }
                        break;
                    case 'keyup':
                        delete events[eventKey];
                        break;
                    }

                    velocity = $.isFunction(velocity) ? velocity(event.timeStamp) : velocity;

                    var data = createMIDIEventData(status | opts.channel, eventCode, velocity);
                    $el.trigger('message', new MIDIEvent(event.timeStamp, data));
                };
            },
            // save references of callback to support detachment if necessary
            keydown = createEventCallback(NOTE_ON, opts.noteOnVelocity),
            keyup = createEventCallback(NOTE_OFF, opts.noteOffVelocity);


        plugin._defaults = defaults;

        plugin.option = function (name, value) {
            if (PARAMETERS.indexOf(name) > -1) {
                opts[name] = value;
            }
        };

        // bind events
        $el.on(EVENT_KEYDOWN, keydown);
        $el.on(EVENT_KEYUP, keyup);

        plugin[DESTROY_METHOD_NAME] = function () {
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

                if (options === DESTROY_METHOD_NAME) {
                    $.data(this, pluginDataName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }

    };

    return $.fn[pluginName];

}));
