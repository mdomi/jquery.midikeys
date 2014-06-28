/* global assert: false, describe: false, it: false, beforeEach: false, afterEach: false */
(function (document, $) {
    'use strict';

    function fail() {
        assert.fail('Should not occur');
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

            function testKeydown(key, note, name) {
                $el.midiKeys('option', 'onmidimessage', test.noteOnMessageVerifier(note, name));
                test.triggerKeydown($el[0], key);
            }

            function testKeyup(key, note, name) {
                $el.midiKeys('option', 'onmidimessage', test.noteOffMessageVerifier(note, name));
                test.triggerKeyup($el[0], key);
            }

            function testKeydownWithNoEvent(key) {
                $el.midiKeys('option', 'onmidimessage', fail);
                test.triggerKeydown($el[0], key);
            }

            it('translates keydown events into MIDI NOTE ON messages', function () {
                test.getNoteData().map(function (args) {
                    testKeydown.apply(this, args);
                });
            });

            it('translates keyup events into MIDI NOTE OFF messages', function () {
                test.getNoteData().map(function (args) {
                    testKeyup.apply(this, args);
                });
            });

            it('does not execute a callback for a non-registered key', function () {
                testKeydownWithNoEvent('1');
                testKeydownWithNoEvent('A');
            });

            it('does not execute a callback for a duplicated event', function () {
                testKeydown('G', 54, 'F#3');
                testKeydownWithNoEvent('G');
            });

            afterEach(function () {
                $el.midiKeys('destroy');
            });
        });

    });

}(this.document, this.jQuery));
