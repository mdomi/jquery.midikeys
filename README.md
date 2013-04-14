# jquery.midikeys [![Build Status](https://secure.travis-ci.org/mdomi/jquery.midikeys.png)](http://travis-ci.org/mdomi/jquery.midikeys)

A jQuery plugin which captures the keyboard events and translates them into appropriate MIDI events.

With the large explosion of browser functionality in the realm of [audio](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html "Web Audio API") and [MIDI](http://www.w3.org/TR/webmidi/ "Web MIDI API"), I found myself in need of a the ability to have a source of MIDI events in situations where it was not convenient to actually utilize a MIDI device. In many applications, the computer keyboard is mapped to a set of notes that can be used to play a software synthesizer utilizing the computer keyboard. This plugin enables these same mappings to be bound in a JavaScript application. 

## Usage

Simple usage:
```html
<script src="jquery.js"></script>
<script src="jquery.midikeys.min.js"></script>
<script>
  $(function () {
    $(body).midiKeys();
    $(body).on('message', function (event, message) {
      // handle MIDI message
    });
  });
</script>
```

The message passed to event handlers implements the IDL for the [Web MIDI API MIDIEvent interface](http://www.w3.org/TR/webmidi/#midievent-interface).

## Options

`.midiKeys()` can take an options object as an argument, with a number of parameters.

* `startNote`
  * Integer
  * corresponding the note that the keyboard letter `Z` should trigger.
  * Defaults to 48, corresponding to C3.
* `noteOnVelocity`
  * Integer
  * The velocity that will be passed in NOTE ON events
  * Defaults to 128
* `noteOffVelocity`
  * Integer
  * The velocity that will be passed in NOTE OFF events
  * Defaults to 128
* `channel`
  * Integer
  * The MIDI channel on which events will be triggered.
  * Defaults to 0

# Compatability

Tested against jQuery 1.9.1, 1.8.3, 1.7.2.
