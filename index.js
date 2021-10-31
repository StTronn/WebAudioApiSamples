const context = new AudioContext();

const soundmap = {
	kick:
		"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav",
	hihat:
		"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav ",
	openhat: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav",
	snare:
		"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav",
	tom:
		"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav",
	ride:
		"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav"
};



function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}




function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};


function playSound(buffer, time = 0) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source[source.start ? 'start' : 'noteOn'](time);
}


let bufferObj = {}; // stores and loads all your sounds 
loadSounds(bufferObj, soundmap)
console.log(bufferObj)

var startOffset = 0;

const play = () => {
  if (context.state==='suspended')  context.resume();

  const osc = context.createOscillator();
  osc.type= 'triangle';
  osc.frequency.value = 350; 

  //increase the freq
  osc.frequency.exponentialRampToValueAtTime(600,context.currentTime + 1);
Node
  //drop the volume
  const gainNode = context.createGain();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);


  osc.start(0);

  //stop after 1 second 
  osc.stop(context.currentTime + 1);

  osc.connect(gainNode).connect(context.destination);
}
