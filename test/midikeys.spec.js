/* global describe: false, it: false, beforeEach: false */
(function (document, MIDIKeys) {
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

    describe('MIDIKeys', function () {

        var el, plugin;

        function messageVerifier(note, name) {
            return function (message) {
                expect(message.data[0]).to.equal(0x90, 'Should be a MIDI NOTE ON event');
                expect(message.data[1]).to.equal(note, 'Should be a ' + name + ' note');
                expect(message.data[2]).to.equal(127, 'Should have default velocity');
            };
        }

        beforeEach(function () {
            el = document.createElement('div');
            plugin = new MIDIKeys(el);
        });

        it('translates keydown events into MIDI NOTE ON messages', function () {
            plugin.option('onmidimessage', messageVerifier(48, 'C3'));
            triggerKeydown(el, 'Z');
        });

    });

}(this.document, this.MIDIKeys));
