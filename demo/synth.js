(function (window, document, $, MIDIKeys, AudioContext) {
    'use strict';

    var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        release = 0.05,
        portamento = 0.05,
        attack = 0.05;

    function joinBytes(bytes) {
        return Array.prototype.map.call(bytes, function (data) {
            return '0x' + data.toString(16);
        }).join(' ');
    }

    function getNoteName(noteByte) {
        var note = notes[noteByte % 12],
            octave = Math.floor((noteByte - 12) / 12);
        return note + octave + ' (' + noteByte + ')';
    }

    function getChannel(event) {
        return event.data[0] & 0x0f;
    }

    function noteEventToString(event) {
        return [
            getNoteName(event.data[1]),
            'velocity=' + event.data[2],
            'channel=' + getChannel(event)
        ].join(', ');
    }

    function messageToString(event) {
        var command = event.data[0] & 0xf0;
        if (command === 0x90) {
            return 'NOTE ON ' + noteEventToString(event);
        }
        if (command === 0x80) {
            return 'NOTE OFF ' + noteEventToString(event);
        }
        return joinBytes(event.data);
    }

    function setupSynthesizer() {
        var context = new AudioContext(),
            oscillator = context.createOscillator(),
            envelope = context.createGain(),
            activeNotes = [];
        oscillator.frequency.setValueAtTime(110, 0);
        oscillator.connect(envelope);
        envelope.connect(context.destination);
        envelope.gain.value = 0.0;
        oscillator.start(0);

        function setOscillatorFrequency(x) {
            oscillator.frequency.cancelScheduledValues(0);
            oscillator.frequency.setTargetAtTime(frequencyFromNoteNumber(x), 0, portamento);
        }

        return {
            noteOn : function (noteNumber) {
                activeNotes.push(noteNumber);
                oscillator.frequency.cancelScheduledValues(0);
                setOscillatorFrequency(noteNumber);
                envelope.gain.cancelScheduledValues(0);
                envelope.gain.setTargetAtTime(1.0, 0, attack);
            },
            noteOff : function (noteNumber) {
                var position = activeNotes.indexOf(noteNumber);
                if (position !== -1) {
                    activeNotes.splice(position, 1);
                }
                if (activeNotes.length === 0) {
                    envelope.gain.cancelScheduledValues(0);
                    envelope.gain.setTargetAtTime(0.0, 0, release);
                } else {
                    setOscillatorFrequency(activeNotes[activeNotes.length - 1]);
                }
            }
        };
    }

    function frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    $(function () {
        var $log = $('#log'),
            plugin = new MIDIKeys(document.body, {
                channel : 7,
                noteOffVelocity : 0x7f,
                noteOnVelocity : function (timestamp) {
                    return timestamp % 0x7f;
                }
            }),
            synth = setupSynthesizer();
        plugin.option('onmidimessage', function (event) {
            var command = event.data[0] & 0xf0,
                message = 'MIDI message received at timestamp ' + event.timestamp +
                ' [' + event.data.length + ' bytes]: ' + messageToString(event);
            $('<p></p>').text(message).appendTo($log);
            if ($log.find('p').length > 20) {
                $log.find('p:first').remove();
            }
            if (command === 0x90) {
                synth.noteOn(event.data[1]);
            } else if (command === 0x80) {
                synth.noteOff(event.data[1]);
            }
        });
    });

}(this, this.document, this.jQuery, this.MIDIKeys, this.AudioContext || this.webkitAudioContext));
