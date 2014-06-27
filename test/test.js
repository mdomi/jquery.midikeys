/* global describe: false, it: false, beforeEach: false, afterEach: false */
(function (document, $) {
    'use strict';

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

            function createKeyEvent(c) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('keydown', true, false);
                event.keyCode = c.charCodeAt(0);
                return event;
            }

            var $el;

            beforeEach(function () {
                $el = $('<div></div>').midiKeys();
                $el.appendTo(document.body);
            });

            it('translates keydown events into MIDI NOTE ON messages', function (done) {
                $el.midiKeys('option', 'onmidimessage', function (message) {
                    expect(message.data[0]).to.equal(0x90, 'Should be a MIDI NOTE ON event');
                    expect(message.data[1]).to.equal(48, 'Should be a C3 note');
                    expect(message.data[2]).to.equal(127, 'Should have default velocity');
                    done();
                });

                $el[0].dispatchEvent(createKeyEvent('Z'));
            });

            afterEach(function () {
                $el.midiKeys('destroy');
                $el.remove();
            });
        });




    });

}(this.document, this.jQuery));
