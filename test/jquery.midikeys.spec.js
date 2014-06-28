/* global describe: false, it: false, beforeEach: false, afterEach: false */
(function (document, $) {
    'use strict';

    function createKeyEvent(type, key) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, false);
        event.keyCode = key.charCodeAt(0);
        return event;
    }

    function triggerKeyEvent(el, type, key) {
        el.dispatchEvent(createKeyEvent(type, key));
    }

    function triggerKeydown(el, key) {
        triggerKeyEvent(el, 'keydown', key);
    }

    describe('jquery.midiKeys', function () {

        describe('plugin registration', function () {

            it('should be attached to jQuery prototype', function () {
                expect($.fn.hasOwnProperty('midiKeys')).to.equal(true);
            });

            it('initializes with defaults withour error, returning the element', function () {
                var $el = $('<div></div>');
                expect($el).to.equal($el.midiKeys());
            });

        });

        describe('execution', function () {

            var $el;

            beforeEach(function () {
                $el = $('<div></div>').midiKeys();
            });

            it('translates keydown events into MIDI NOTE ON messages', function (done) {
                $el.midiKeys('option', 'onmidimessage', function (message) {
                    expect(message.data[0]).to.equal(0x90, 'Should be a MIDI NOTE ON event');
                    expect(message.data[1]).to.equal(48, 'Should be a C3 note');
                    expect(message.data[2]).to.equal(127, 'Should have default velocity');
                    done();
                });

                triggerKeydown($el[0], 'Z');
            });

            afterEach(function () {
                $el.midiKeys('destroy');
            });
        });

    });

}(this.document, this.jQuery));
