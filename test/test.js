(function ($) {
    'use strict';

    test('plugin is set up', function () {

        ok($.fn.hasOwnProperty('midiKeys'), 'plugin should be attached to jQuery prototype');

    });

    test('plugin initializes with defaults without error, returning the element', function () {

        var $el = $('#test-target');

        equal($el, $el.midiKeys());

    });

    asyncTest('translates keydown events into MIDI NOTE ON messages', function () {
        expect(3);

        var $el = $('#test-target').midiKeys();

        $el.on('message', function (event, message) {
            console.log(event);
            equal(message.data[0], 0x90, 'Should be a MIDI NOTE ON event');
            equal(message.data[1], 48, 'Should be a C3 note');
            equal(message.data[2], 127, 'Should have default velocity');
            start();
        });

        var event = $.Event('keydown');
        event.keyCode = 'Z'.charCodeAt(0);
        $el.trigger(event);
    });

}(jQuery));