jquery.midikeys [![Build Status](https://secure.travis-ci.org/mdomi/jquery.midikeys.png)](http://travis-ci.org/mdomi/jquery.midikeys)
=====================================================================================================================================

A jQuery plugin which captures the keyboard events and translates them into appropriate MIDI events.

With the large explosion of browser functionality in the realm of [audio](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html "Web Audio API") and [MIDI](http://www.w3.org/TR/webmidi/ "Web MIDI API"), I found myself in need of a the ability to have a source of MIDI events in situations where it was not convenient to actually utilize a MIDI device. In many applications, the computer keyboard is mapped to a set of notes that can be used to play a software synthesizer utilizing the computer keyboard. This plugin enables these same mappings to be bound in a JavaScript application. 

Usage
-----
Simple usage:
```html
<script src="jquery.js"></script>
<script src="jquery.midikeys.min.js"></script>
<script>
  $(function () {
    $(body).midiKeys();
  });
</script>
```
