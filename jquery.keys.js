/**
 * jquery.midikeys.js
 * (c) 2013 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
/* jshint bitwise:false */
/* global Uint8Array:false, define:false */
(function (root, factory) {
    'use strict';
    if (typeof define !== 'undefined' && define.amd) {
        define(['jquery'], function ($) {
            return factory($);
        });
    } else {
        return factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';

    var NOTE_ON = 0x90,
        NOTE_OFF = 0x80,
        NOTES_PER_OCTAVE = 12,
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        defaults = {
            startNote : 48, // C3
            noteOnVelocity : 0x7f, // 128
            noteOffVelocity : 0x40, // 64,
            channel : 0
        },
        PARAMETERS = [],
        pluginName = 'midiKeys',
        pluginDataName = '_plugin_' + pluginName,
        keys = 'ZSXDCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P',
        events = {},
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
        },
        createEventCallback = function (status, velocityKey) {
            return function (event) {
                var eventCode = getEventCode(event, this.options.startNote),
                    velocity = this.options[velocityKey],
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

                if ($.isFunction(velocity)) {
                    velocity = velocity(event.timeStamp);
                }

                var data = createMIDIEventData(status | this.options.channel, eventCode, velocity);
                this.$element.trigger('message', new MIDIEvent(event.timeStamp, data));
            };
        };

    PARAMETERS = $.map(defaults, function (value, key) {
        return key;
    });

    function MIDIEvent(timestamp, data) {
        this.timestamp = timestamp;
        this.data = data;
    }

    MIDIEvent.prototype = {
        getChannel : function () {
            return this.data[0] & 0x0f;
        },
        getVelocity : function () {
            return this.data[2];
        },
        getOctave : function () {
            return Math.floor(this.data[1] / NOTES_PER_OCTAVE) - 1;
        },
        getNoteLetter : function () {
            return notes[this.data[1] % NOTES_PER_OCTAVE];
        },
        getNote : function () {
            return this.getNoteLetter() + this.getOctave();
        },
        toString : function () {
            var parts = [
                'type=' + this.getType(),
                'channel=' + this.getChannel(),
                'note=' + this.getNote(),
                'velocity=' + this.getVelocity()
            ];
            return 'MIDIEvent[' + parts.join(',') + ']';
        },
        getType : function () {
            var statusWithoutChannel = this.data[0] & 0xf0;
            if (statusWithoutChannel === NOTE_ON) {
                return 'NOTE ON';
            }
            if (statusWithoutChannel === NOTE_OFF) {
                return 'NOTE OFF';
            }
        }
    };

    function MIDIKeys (element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;

        this.init();
    }

    MIDIKeys.prototype = {
        init : function () {
            var keydown = $.proxy(createEventCallback(NOTE_ON, 'noteOnVelocity'), this),
                keyup = $.proxy(createEventCallback(NOTE_OFF, 'noteOffVelocity'), this);
            this.$element.on('keydown', keydown);
            this.$element.on('keyup', keyup);
            this.destroy = function () {
                this.$element.off('keydown', keydown);
                this.$element.off('keyup', keyup);
            };
        },
        option : function (name, value) {
            if (PARAMETERS.indexOf(name) > -1) {
                this.options[name] = value;
            }
        }
    };

    $.fn[pluginName] = function (options) {

        var args = arguments;

        if (options === void 0 || typeof options === 'object') {

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

                if (options === 'destroy') {
                    $.data(this, pluginDataName, null);
                }
            });

            return returns !== void 0 ? returns : this;
        }

    };

    return $.fn[pluginName];

}));
