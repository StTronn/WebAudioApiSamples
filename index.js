const context = new AudioContext();

const analyser = context.createAnalyser();
const frequencyData = new Uint8Array(200);

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
  bufferLoader = new BufferLoader(context, paths, function (bufferList) {
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

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function (error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function () {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function () {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};


function playSound(buffer, time = 0) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}


let bufferObj = {}; // stores and loads all your sounds 
loadSounds(bufferObj, soundmap)
console.log(bufferObj)

const startOffset = 0;

const playHiHat = () => {
  const startTime = context.currentTime + 0.100;
  const tempo = 80; // BPM (beats per minute)
  const eighthNoteTime = (60 / tempo) / 2;

  for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;

    // Play the bass (kick) drum on beats 1, 5
    playSound(bufferObj.kick, time);
    playSound(bufferObj.kick, time + 4 * eighthNoteTime);

    // Play the snare drum on beats 3, 7
    playSound(bufferObj.snare, time + 2 * eighthNoteTime);
    playSound(bufferObj.snare, time + 6 * eighthNoteTime);

    // Play the hihat every eighth note.
    for (var i = 0; i < 8; ++i) {
      playSound(bufferObj.hihat, time + i * eighthNoteTime);
    }
  }
}


const playSick = () => {
  // AnimateButton();

  const startTime = context.currentTime + 0.100;
  const tempo = 120; // BPM (beats per minute)
  const eighthNoteTime = (60 / tempo) / 2;

  for (var bar = 0; bar < 3; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;

    // Play the bass (kick) drum on beats 1, 3, 5
    playSound(bufferObj.kick, time);
    playSound(bufferObj.kick, time + 3 * eighthNoteTime);
    playSound(bufferObj.kick, time + 5 * eighthNoteTime);

    // Play the snare drum on beats 3, 7
    playSound(bufferObj.snare, time + 2 * eighthNoteTime);
    playSound(bufferObj.snare, time + 6 * eighthNoteTime);
  }
}


const drumRoll = () => {
  let count = 0;
  var startTime = context.currentTime + 0.100;
  while (count < 10) {
    playSound(bufferObj.snare, startTime + count * 0.08);
    count++;
  }
}

function AnimateButton() {
  analyser.getByteFrequencyData(frequencyData);
  requestAnimationFrame(AnimateButton);
  console.log(frequencyData);

} 