/* global assert: false, describe: false, it: false, beforeEach: false */
(function (document, MIDIKeys) {
    'use strict';

    var NOTE_DATA = [
        // lower octave
        ['Z', 48, 'C3'],
        ['S', 49, 'C#3'],
        ['X', 50, 'D3'],
        ['D', 51, 'D#3'],
        ['C', 52, 'E3'],
        ['V', 53, 'F3'],
        ['G', 54, 'F#3'],
        ['B', 55, 'G3'],
        ['H', 56, 'G#3'],
        ['N', 57, 'A4'],
        ['J', 58, 'A#4'],
        ['M', 59, 'B4'],
        // upper ocatve
        ['Q', 60, 'C4'],
        ['2', 61, 'C#4'],
        ['w', 62, 'D4'],
        ['3', 63, 'D#4'],
        ['E', 64, 'E4'],
        ['R', 65, 'F4'],
        ['5', 66, 'F#4'],
        ['T', 67, 'G4'],
        ['6', 68, 'G#4'],
        ['Y', 69, 'A5'],
        ['7', 70, 'A#5'],
        ['U', 71, 'B5']
    ];

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

    function triggerKeyup(el, key) {
        triggerKeyEvent(el, 'keyup', key);
    }

    describe('MIDIKeys', function () {

        var el, plugin;

        function noteOnMessageVerifier(note, name) {
            return function (message) {
                expect(message.data[0]).to.equal(0x90, 'Should be a MIDI NOTE ON event');
                expect(message.data[1]).to.equal(note, 'Should be a ' + name + ' note');
                expect(message.data[2]).to.equal(127, 'Should have default NOTE ON velocity');
            };
        }

        function noteOffMessageVerifier(note, name) {
            return function (message) {
                expect(message.data[0]).to.equal(0x80, 'Should be a MIDI NOTE OFF event');
                expect(message.data[1]).to.equal(note, 'Should be a ' + name + ' note');
                expect(message.data[2]).to.equal(64, 'Should have default NOTE OFF velocity');
            };
        }

        function fail() {
            assert.fail('Should not occur');
        }

        function testKeydown(key, note, name) {
            plugin.option('onmidimessage', noteOnMessageVerifier(note, name));
            triggerKeydown(el, key);
        }

        function testKeyup(key, note, name) {
            plugin.option('onmidimessage', noteOffMessageVerifier(note, name));
            triggerKeyup(el, key);
        }

        function testNonRegisteredKey(key) {
            plugin.option('onmidimessage', fail);
            triggerKeydown(el, key);
        }

        beforeEach(function () {
            el = document.createElement('div');
            plugin = new MIDIKeys(el);
        });

        it('translates keydown events into MIDI NOTE ON messages', function () {
            NOTE_DATA.map(function (args) {
                testKeydown.apply(this, args);
            });
        });

        it('translates keyup events into MIDI NOTE OFF messages', function () {
            NOTE_DATA.map(function (args) {
                testKeyup.apply(this, args);
            });
        });

        it('does not execute a callback for a non-registered key', function () {
            testNonRegisteredKey('1');
            testNonRegisteredKey('A');
        });

    });

}(this.document, this.MIDIKeys));
