/**
 * jquery.midikeys.js
 * (c) 2012 Michael Dominice
 * jquery.midikeys.js is freely distributable under the MIT license.
 */
(function (root, factory) {
    if (typeof define !== 'undefined' && define.amd) {
        define(['jquery'], function ($) {
            return factory($);
        });
    } else {
        return factory(root.jQuery);
    }
}(this, function ($) {

    var NOTE_ON = 0x90,
        NOTE_OFF = 0x80,
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        defaults = {
            startNote : 48, // C3
            noteOnVelocity : 0x7f, // 128
            noteOffVelocity : 0x40, // 64,
            channel : 0
        },
        pluginName = 'midiKeys',
        pluginDataName = 'plugin_' + pluginName,
        keys = 'ZSXDCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P',
        events = {},
        createMIDIEventData = function (status, note, velocity) {
            var data = new Uint8Array(3);
            data[0] = status;
            data[1] = note;
            data[2] = velocity;
            return data;
        },
        getEventCode = function (event) {
            var character = String.fromCharCode(event.keyCode),
                index = keys.indexOf(character);
            if (index < 0) {
                return;
            }
            return this.options.startNote + index;
        },
        createEventCallback = function (status, velocityKey) {
            return function (event) {
                var eventCode = getEventCode.call(this, event),
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
            return Math.floor(this.data[1] / 12) - 1;
        },
        getNoteLetter : function () {
            return notes[this.data[1] % 12];
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
                this.$element.removeData(pluginDataName);
            };
        }
    };

    return $.fn[pluginName] = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var pluginData = $.data(this, pluginDataName);
            if (pluginData && $.isFunction(pluginData[options])) {
                pluginData[options].apply(pluginData, args);
            } else if (!pluginData) {
                $.data(this, pluginDataName, new MIDIKeys(this, options));
            }
        });
    };

}));