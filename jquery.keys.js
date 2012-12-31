(function (root, factory) {
    if (typeof define !== 'undefined' && define.amd) {
        define(['jquery'], function ($) {
            return factory($);
        });
    } else {
        return factory(root.jQuery);
    }
}(this, function ($) {

    var defaults = {
        noteOnVelocity : 0x7f, // 128
        noteOffVelocity : 0x40 // 64
    };

    var NOTE_ON = 0x90;
    var NOTE_OFF = 0x80;

    var pluginName = 'midiKeys';
    var pluginDataName = 'plugin_' + pluginName;

    var keys = 'ZSXSCVGBHNJM' + 'Q2W3ER5T6Y7U' + 'I9O0P';

    var startNote = 48; // C3

    var events = {};
    var eventPrefix = 'event_';

    var eventKey = function (charCode) {
        return eventPrefix + charCode;
    };

    var createMIDIEvent = function (event, data) {
        return {
            timestamp : event.timeStamp,
            data : data
        };
    };

    $.each(keys, function (i, key) {
        events[eventKey(key.charCodeAt(0))] = startNote + i;
    });

    function MIDIKeys (element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;

        this.init();
    }

    MIDIKeys.prototype = {
        init : function () {
            var keydown = $.proxy(this.keydown, this);
            var keyup = $.proxy(this.keyup, this);
            this.$element.on('keydown', keydown);
            this.$element.on('keyup', keyup);
            this.destroy = function () {
                this.$element.off('keydown', keydown);
                this.$element.off('keyup', keyup);
            };
        },
        keydown : function (event) {
            var eventCode = events[eventKey(event.keyCode)];
            if (!eventCode) {
                return;
            }
            var data = new Uint8Array(3);
            data[0] = NOTE_ON;
            data[1] = eventCode;
            data[2] = this.options.noteOnVelocity;
            this.$element.trigger('midiEvent', createMIDIEvent(event, data));
        },
        keyup : function (event) {
            var eventCode = events[eventKey(event.keyCode)];
            if (!eventCode) {
                return;
            }
            var data = new Uint8Array(3);
            data[0] = NOTE_ON;
            data[1] = eventCode;
            data[2] = this.options.noteOnVelocity;
            this.$element.trigger('midiEvent', createMIDIEvent(event, data));
        }
    };

    return $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginDataName)) {
                $.data(this, pluginDataName, new MIDIKeys(this, options));
            }
        });
    };

}));