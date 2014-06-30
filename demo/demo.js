(function (window, document, $, MIDIKeys) {
    'use strict';

    var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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

    $(function () {
        var $log = $('#log'),
            plugin = new MIDIKeys(document.body, {
                channel : 7,
                noteOffVelocity : 0x7f,
                noteOnVelocity : function (timestamp) {
                    return timestamp % 0x7f;
                }
            });
        plugin.option('onmidimessage', function (event) {
            var message = 'MIDI message received at timestamp ' + event.timestamp +
                ' [' + event.data.length + ' bytes]: ' + messageToString(event);
            $('<p></p>').text(message).appendTo($log);
            if ($log.find('p').length > 20) {
                $log.find('p:first').remove();
            }
        });
    });

}(this, this.document, this.jQuery, this.MIDIKeys));
