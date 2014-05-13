(function (document, $) {
    'use strict';

    module('setup');
    test('plugin is set up', function () {
        ok($.fn.hasOwnProperty('midiKeys'), 'plugin should be attached to jQuery prototype');
    });

    var $el;

    module('plugin', {
        teardown : function () {
            if ($el) {
                $el.midiKeys('destroy');
            }
        }

    });
    test('plugin initializes with defaults without error, returning the element', function () {
        $el = $('#test-target');
        equal($el, $el.midiKeys());

    });

    test('translates keydown events into MIDI NOTE ON messages', function () {
        var receivedMessage;

        $el = $('#test-target').midiKeys({
            onmidimessage : function (message) {
                receivedMessage = message;
            }
        });

        var event = document.createEvent('HTMLEvents');
        event.initEvent('keydown', true, false);
        event.keyCode = 'Z'.charCodeAt(0);
        $el[0].dispatchEvent(event);

        equal(receivedMessage.data[0], 0x90, 'Should be a MIDI NOTE ON event');
        equal(receivedMessage.data[1], 48, 'Should be a C3 note');
        equal(receivedMessage.data[2], 127, 'Should have default velocity');
    });

}(this.document, this.jQuery));
