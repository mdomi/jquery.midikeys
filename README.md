# MIDIKeys [![Build Status](https://secure.travis-ci.org/mdomi/jquery.midikeys.png)](http://travis-ci.org/mdomi/jquery.midikeys)

A tiny JavaScript library or jQuery plugin which captures the keyboard events and translates them into appropriate MIDI events.

With the large explosion of browser functionality in the realm of [audio](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html "Web Audio API") and [MIDI](http://www.w3.org/TR/webmidi/ "Web MIDI API"), I found myself in need of a the ability to have a source of MIDI events in situations where it was not convenient to actually utilize a MIDI device. In many applications, the computer keyboard is mapped to a set of notes that can be used to play a software synthesizer utilizing the computer keyboard. This library enables these same mappings to be bound in a JavaScript application. 

The library maps Z-M to the notes C3-B4, and Q-U to the notes C4-B5 by default. ```keydown``` events are mapped to MIDI ```NOTE ON``` messages, and ```keyup``` events are mapped to MIDI ```NOTE OFF``` messages.

## Quick Info

* Library
    * 1.42 kB minified, 4.75 kB full
* Library + jQuery plugin
    * 1.94 kB minified, 6.16 kB full

## Usage

Library:
```html
<script src="midikeys.min.js"></script>
<script>
  var keys = new MIDIKeys(document.body, {
    onmidimessage : function (message) {
      // handle MIDI message
    }
  });
</script>
```

As a jQuery plugin:
```html
<script src="jquery.js"></script>
<script src="jquery.midikeys.min.js"></script>
<script>
  $(function () {
    $(body).midiKeys({
      onmidimessage : function (message) {
        // handle MIDI message
      }
    });
  });
</script>
```

The message passed to event handlers implements the IDL for the [Web MIDI API MIDIMessageEvent interface](http://www.w3.org/TR/webmidi/#midimessageevent-interface).

## Options

The MIDIKeys constructor takes two arguments, a ```DOMElement``` and an options object. The jQuery plugin method ```.midiKeys()``` also takes an options object. Both have the same set of optional parameters.

* `startNote` (Number)
  * corresponding the note that the keyboard letter `Z` should trigger.
  * Defaults to 48, corresponding to C3.
* `noteOnVelocity` (Number)
  * The velocity that will be passed in NOTE ON events
  * Defaults to 128
* `noteOffVelocity` (Number)
  * The velocity that will be passed in NOTE OFF events
  * Defaults to 128
* `onmidimessage` (Function)
  * A callback that will be executed when a keyboard event is translated to a MIDI message.
  * Callback is passed the MIDI message as an argument, and is called with the DOMElement to which the key event callbacks are attached as ```this```.
