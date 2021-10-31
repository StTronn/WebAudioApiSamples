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


function playSound(buffer, key, time = 0) {
  var source = context.createBufferSource();
  source.buffer = buffer;

  const gainNode = context.createGain();
  console.log(gainObj[key], key);
  gainNode.gain.value = gainObj[key];

  source.connect(gainNode);
  gainNode.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}


let bufferObj = {}; // stores and loads all your sounds 
loadSounds(bufferObj, soundmap, init)

const gainObj = {}
Object.keys(soundmap).forEach(key => gainObj[key] = 1)
console.log(gainObj);

// var startOffset = 0;
//select an element with class drum-area

const onClick = (e) => {
  const drum = e.target;
  const key = drum.getAttribute("data-key");
  console.log({key})
  const buffer = bufferObj[key];
  playSound(buffer, key);
}

function init() {
  const drumArea = document.getElementById("drum-area");
  const entries = Object.entries(bufferObj);
  let count = 1;
  entries.forEach(([key, value]) => {
    const padSection = document.createElement("span");
    padSection.classList.add(`padArea${count}`);
    // padSection.setAttribute("data-key", key);
    const pad = createPads(key,count++); 
    const slider = createSlider(key);
    console.log(slider)
    // drum.innerHTML = key;
    // padSection.appendChild(slider);
    padSection.appendChild(pad);
    drumArea.appendChild(padSection);
  });
  drumArea.addEventListener("click", onClick);
}

function createPads(key,count) {
  const pad = document.createElement("div");
  pad.classList.add(`pad${count}`);
  pad.classList.add('bd');
  pad.setAttribute("data-key", key);
  return pad;
}

function onSliderChange(e) {
  const slider = e.target;
  const key = slider.getAttribute("data-key");
  gainObj[key] = slider.value;
  // const buffer = bufferObj[key];
  // const gainNode = context.createGain();
  // console.log(slider.value);
  // gainNode.gain.value = slider.value;
  // playSound(buffer, 0, gainNode);
}

function createSlider(key) {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  //add data-key attribute to slider
  slider.setAttribute("data-key", key);
  slider.max = "2";
  slider.value = "1";
  slider.step = '0.01'
  slider.classList.add("slider");
  slider.addEventListener("input", onSliderChange);
  return slider;
}

//on Click handler gets the data-key of the clicked element

const onKeyDown = (e) => {
  const key = e.key;
  console.log(key);
}

document.addEventListener("keydown", onKeyDown);



// const play = () => {
// 	console.log(bufferObj);
// 	var startTime = context.currentTime + 0.100;
// 	var tempo = 80; // BPM (beats per minute)
// 	var eighthNoteTime = (60 / tempo) / 2;

// 	for (var bar = 0; bar < 2; bar++) {
// 		var time = startTime + bar * 8 * eighthNoteTime;
// 		// Play the bass (kick) drum on beats 1, 5
// 		playSound(bufferObj.kick, time);
// 		playSound(bufferObj.kick, time + 4 * eighthNoteTime);
// 		// Play the snare drum on beats 3, 7
// 		playSound(bufferObj.snare, time + 2 * eighthNoteTime);
// 		playSound(bufferObj.snare, time + 6 * eighthNoteTime);
// 		// Play the hihat every eighth note.
// 		for (var i = 0; i < 8; ++i) {
// 			playSound(bufferObj.hihat, time + i * eighthNoteTime);
// 		}
// 	}
// }

// const drumRoll = ()=>{
// 	let count = 0;
// 	var startTime = context.currentTime + 0.100;
// 	while(count<10){
// 		playSound(bufferObj.snare, startTime+ count*0.08);
// 		count++;
// 	}
// }