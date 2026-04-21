const audioContext = new AudioContext();
const beepOsc = new OscillatorNode(audioContext, { frequency: 1000 });
const adsr = new GainNode(audioContext, { gain: 0 });
const masterGain = new GainNode(audioContext, { gain: 0.8 });

beepOsc.connect(adsr).connect(masterGain).connect(audioContext.destination);

// beepOsc.connect(adsr).connect(audioContext.destination);
const volumeSlider = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const muteIcon = document.getElementById("muteIcon");

muteIcon.addEventListener("click", function () {
  console.log("mute button clicked");

  if (isMuted) {
    // UNMUTE
    masterGain.gain.setValueAtTime(lastVolume, audioContext.currentTime);

    volumeSlider.value = Math.round(lastVolume * 100);
    volumeValue.textContent = volumeSlider.value + "%";

    muteIcon.innerHTML = "&#128266;"; // 🔊
    isMuted = false;
    console.log("unmute");
  } else {
    // MUTE
    const currentVolume = volumeSlider.value / 100;

    if (currentVolume > 0) {
      lastVolume = currentVolume;
    }

    masterGain.gain.setValueAtTime(0, audioContext.currentTime);

    volumeSlider.value = 0;
    volumeValue.textContent = "0%";

    muteIcon.innerHTML = "&#128263;"; // 🔇
    isMuted = true;
    console.log("mute");
  }
});

let lastVolume = 0.8;
let isMuted = false;
let oscActive = false;
let isPlaying = false;
let secondsPerBeat;
let nextNoteTime;
let metronomeInterval;
const tapTimes = [];
let direction = 1; // 1 for right, -1 for left

const tempoSlider = document.getElementById("tempo");
const tempoValue = document.getElementById("tempoValue");
const status = document.getElementById("status");

volumeSlider.addEventListener("input", function () {
  const volume = volumeSlider.value / 100;

  masterGain.gain.setValueAtTime(volume, audioContext.currentTime);
  volumeValue.textContent = volumeSlider.value + "%";

  if (volume > 0) {
    lastVolume = volume;
    isMuted = false;
  } else {
    isMuted = true;
  }
});

// 1. Update ONLY the text while dragging (no audio restart)
tempoSlider.addEventListener("input", function () {
  tempoValue.textContent = tempoSlider.value + " BPM";
});

// secondsPerBeat = 60 / tempoSlider.value;
console.log(secondsPerBeat);
// 2. Restart the metronome ONLY when the user lets go
tempoSlider.addEventListener("change", function () {
  if (isPlaying) {
    runMetronome();
  }
});

function runMetronome() {
  clearInterval(metronomeInterval);
  secondsPerBeat = 60 / tempoSlider.value;
  nextNoteTime = audioContext.currentTime;

  // animatePendulum();
  // bob.classList.add("moving");
  scheduleBeep();
  metronomeInterval = setInterval(scheduleBeep, secondsPerBeat * 1000);
}

// const startBtn = document.getElementById("startBtn");
// const stopBtn = document.getElementById("stopBtn");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", function () {
  if (isPlaying) {
    stopMetronome();
  } else {
    if (!oscActive) {
      oscActive = true;
      beepOsc.start();
    }
    startMetronome();
  }
});

async function startMetronome() {
  isPlaying = true;

  // reset position
  direction = 1;
  bob.style.transform = "translate(0px, -50%)";

  await audioContext.resume();

  runMetronome();

  status.textContent = "Playing";
  toggleBtn.textContent = "Stop";
}

function stopMetronome() {
  clearInterval(metronomeInterval);

  isPlaying = false;

  // reset position
  direction = 1;
  bob.style.transform = "translate(0px, -50%)";

  status.textContent = "Stopped";
  toggleBtn.textContent = "Start";
}

function Beep(time) {
  let now = audioContext.currentTime;
  adsr.gain.cancelScheduledValues(now);
  adsr.gain.setValueAtTime(0, now);
  adsr.gain.linearRampToValueAtTime(1, now + 0.01);
  adsr.gain.linearRampToValueAtTime(0, now + 0.02);
  // const osc = audioContext.createOscillator();
  // osc.type = "square";
  // osc.frequency.setValueAtTime(1000, time);
  // osc.connect(audioContext.destination);
  // osc.start(time);
  // osc.stop(time + 0.1); // stop after 100ms
}

function scheduleBeep() {
  // Implementation for scheduling beep
  Beep(nextNoteTime);
  flashBob(nextNoteTime);
  moveBob(nextNoteTime);
  nextNoteTime += secondsPerBeat;
}
// const tapBtn = document.getElementById("tapBtn");

// tapBtn.addEventListener("click", function () {
//   console.log("Tap button clicked");
//   // implement tap tempo functionality here
//   const currentTime = audioContext.currentTime;

//   if (tapTimes.length > 0 && currentTime - tapTimes[tapTimes.length - 1] > 6) {
//     tapTimes.length = 0;
//   }

//   tapTimes.push(currentTime);

//   if (tapTimes.length > 4) {
//     tapTimes.shift();
//   }

//   if (tapTimes.length > 1) {
//     const intervals = [];
//     for (let i = 1; i < tapTimes.length; i++) {
//       intervals.push(tapTimes[i] - tapTimes[i - 1]);
//     }
//     let sum = 0;

//     for (let i = 0; i < intervals.length; i++) {
//       sum += intervals[i];
//     }

//     const averageInterval = sum / intervals.length;
//     // const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
//     const newTempo = 60 / averageInterval;
//     tempoSlider.value = newTempo;
//     tempoValue.textContent = Math.round(newTempo) + " BPM";
//     if (isPlaying) {
//       runMetronome();
//     }
//   }
// });

document.body.addEventListener("click", function (event) {
  // ignore clicks on controls
  if (
    event.target.closest("#toggleBtn") ||
    event.target.closest("#tempo") ||
    event.target.closest("#volume") ||
    event.target.closest("label") ||
    event.target.closest("#muteIcon")
  ) {
    return;
  }

  console.log("Background tapped");

  const currentTime = audioContext.currentTime;

  if (tapTimes.length > 0 && currentTime - tapTimes[tapTimes.length - 1] > 6) {
    tapTimes.length = 0;
  }

  tapTimes.push(currentTime);

  if (tapTimes.length > 4) {
    tapTimes.shift();
  }

  if (tapTimes.length > 1) {
    const intervals = [];

    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }

    let sum = 0;
    for (let i = 0; i < intervals.length; i++) {
      sum += intervals[i];
    }

    const averageInterval = sum / intervals.length;
    const newTempo = 60 / averageInterval;

    tempoSlider.value = Math.round(newTempo);
    tempoValue.textContent = Math.round(newTempo) + " BPM";

    if (isPlaying) {
      runMetronome();
    }
  }
});

const bob = document.getElementById("bob");

// function animatePendulum() {
//   bob.style.animationDuration = secondsPerBeat + "s";
// }
function moveBob(time) {
  const delay = Math.max(0, (time - audioContext.currentTime) * 1000);
  const distance = 252;

  setTimeout(() => {
    bob.style.transitionDuration = secondsPerBeat + "s";

    if (direction === 1) {
      bob.style.transform = `translate(${distance}px, -50%)`;
      direction = -1;
    } else {
      bob.style.transform = `translate(0px, -50%)`;
      direction = 1;
    }
  }, delay);
}

function flashBob(time) {
  const delay = Math.max(0, time - audioContext.currentTime) * 1000;

  setTimeout(function () {
    bob.classList.add("flash");

    setTimeout(function () {
      bob.classList.remove("flash");
    }, 100);
  }, delay);
}
