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
    "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav",
};



function loadSounds(obj, soundMap, callback) {
  // Array-ify
  let names = [];
  let paths = [];
  for (let name in soundMap) {
    let path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function (bufferList) {
    for (let i = 0; i < bufferList.length; i++) {
      let buffer = bufferList[i];
      let name = names[i];
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
  let request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  let loader = this;

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
  for (let i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};


let bufferObj = {}; // buffer for each sound/key 
// takes url and creates buffer
loadSounds(bufferObj, soundmap, init)

const gainObj = {}
Object.keys(soundmap).forEach(key => gainObj[key] = 1)

// let startOffset = 0;
//select an element with class drum-area








// Play Sound
function playSound(buffer, time = 0) {
  //create BufferSource
  let source = context.createBufferSource();

  //assign Buffer
  source.buffer = buffer;

  //connect to destination
  source.connect(context.destination);
  source.start(time);
}
















//Play Sound with Individual Gain
function playSoundGain(buffer, key, time = 0) {
  let source = context.createBufferSource();
  source.buffer = buffer;

  const gainNode = context.createGain();
  gainNode.gain.value = gainObj[key];

  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(time);
}










function init() {
  const drumArea = document.getElementById("drum-area");

  let count = 1;

  Object.entries(bufferObj).forEach(([key]) => {
    const padSection = document.createElement("span");
    padSection.classList.add(`padArea${count}`);

    const pad = createDrumPad(key, count++);

    // const slider = createSlider(key);
    // padSection.setAttribute("data-key", key);
    // padSection.appendChild(slider);
    padSection.appendChild(pad);
    drumArea.appendChild(padSection);
  });
  drumArea.addEventListener("click", onClick);
}


function onClick(e) {
  const drum = e.target;
  const key = drum.getAttribute("data-key");
  const buffer = bufferObj[key];
  // playSoundGain(buffer, key);
  playSound(buffer);
}


function createDrumPad(key, count) {
  const pad = document.createElement("div");
  //adding class for styling
  pad.classList.add(`pad${count}`, 'bd');

  //adding key(Instrument) to be accessed when clicked
  pad.setAttribute("data-key", key);

  return pad;
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


function onSliderChange(e) {
  const slider = e.target;
  const key = slider.getAttribute("data-key");
  gainObj[key] = slider.value;
}

//add a keyDown listener which plays the different sounds for keys 1 to 6
document.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key >= 1 && key <= 6) {
    const buffer = Object.values(bufferObj)[key - 1];
    playSound(buffer);
  }
});