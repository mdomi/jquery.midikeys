/* global assert: false, describe: false, it: false, beforeEach: false */
(function (document, test, MIDIKeys) {
    'use strict';

    describe('MIDIKeys', function () {

        var el, plugin;

        function fail() {
            assert.fail('Should not occur');
        }

        function testKeydown(key, note, name) {
            plugin.option('onmidimessage', test.noteOnMessageVerifier(el, note, name));
            test.triggerKeydown(el, key);
        }

        function testKeyup(key, note, name) {
            plugin.option('onmidimessage', test.noteOffMessageVerifier(el, note, name));
            test.triggerKeyup(el, key);
        }

        function testKeydownWithNoEvent(key) {
            plugin.option('onmidimessage', fail);
            test.triggerKeydown(el, key);
        }

        beforeEach(function () {
            el = document.createElement('div');
            plugin = new MIDIKeys(el);
        });

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

    });

}(this.document, this.test, this.MIDIKeys));
