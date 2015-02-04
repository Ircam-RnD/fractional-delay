## Fractional Delay library

> The Fractional Delay is a JavaScript library that implements a delay with a fractional delay.

This library implements a delay with a fractional delay approximation using a [first-order allpass interpolation](https://ccrma.stanford.edu/~jos/pasp/First_Order_Allpass_Interpolation.html), also called Thiran approximation.

```
               ____________________            ____________________
              |     M samples      |          |    ▲ fractional    |
y[n] -------> |   integer delay    | -------> |        delay       | -------> y[n - M - ▲]
              |____________________|          |____________________|


The M samples integer delay is implemented as a simple delay line: y[n] = x[n - M]
                                                                                           1 - ▲
The ▲ fractional delay is implemented as: y[n] = μ·x[n] + x[n - 1] - μ·y[n - 1] where μ = -------
                                                                                           1 + ▲

```


###Demo

A *non* working demo for this module can be found [here](https://ircam-rnd.github.io/fractional-delay/)

### Usage

This library can be used, for instance, inside the Web Audio API:

```html
    <script src="/fractional-delay.min.js"></script>
    <!-- https://github.com/Ircam-RnD/buffer-loader  We need a way to load and decode the HRTF files, so we use this lib -->
    <script src="/examples/js/buffer-loader.js"></script>
    <!-- https://github.com/Ircam-RnD/player - We use this player to play a sound -->
    <script src="/examples/js/player.js"></script>
```

```js
  // We need an audio context
  var audioContext = new AudioContext();
  var targetNode = audioContext.destination;
  // Create Audio Nodes
  var player = createPlayer();
  var bufferLoader = createBufferLoader();
  var scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
  // Connect Audio Nodes
  player.connect(scriptProcessor);
  scriptProcessor.connect(targetNode);

  // Create biquad filter module
  var sampleRate = 44100;
  var maxDelay = 1;
  var fractionalDelayNode = createFractionalDelay(sampleRate, maxDelay);
  fractionalDelayNode.setDelay(0.255);


  // Load player file
  bufferLoader.load('/examples/snd/breakbeat.wav').then(function(buffer){
    player.setBuffer(buffer);
    player.enableLoop(true);
    player.start();
  })

  // Process the data inside the scriptProcessor process
  scriptProcessor.onaudioprocess = function(event){
    // Get the input buffer
    var inputBuffer = event.inputBuffer.getChannelData(0);
    // Get the ouput buffer
    var outputBuffer = event.outputBuffer.getChannelData(0);

    // Process the data
    var output = fractionalDelayNode.process(inputBuffer);
    // Copy the output to the outputBuffer
    for(var i = 0; i<inputBuffer.length; i++){
      outputBuffer[i] = output[i];
    }

  }

```

### API

The `fractionalDelay` object exposes the following API:

Method | Description
--- | ---
`fractionalDelay.setDelay(delayTime)` | Set the delay time.
`fractionalDelay.getDelay()` | Get the delay time.
`fractionalDelay.process(inputBuffer)` | Process the data for an input buffer.

## License

This module is released under the [BSD-3-Clause license](http://opensource.org/licenses/BSD-3-Clause).

## Acknowledgments

This code has been developed from both [Acoustic And Cognitive Spaces](http://recherche.ircam.fr/equipes/salles/) and [Analysis of Musical Practices](http://apm.ircam.fr) IRCAM research teams. It is also part of the WAVE project (http://wave.ircam.fr), funded by ANR (The French National Research Agency), ContInt program, 2012-2015.
