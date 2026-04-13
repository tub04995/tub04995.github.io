const audioContext = new AudioContext();
let isPlaying = false;
let secondsPerBeat;
let nextNoteTime;
let metronomeInterval;
const tapTimes = [];
let direction = 1; // 1 for right, -1 for left

const tempoSlider = document.getElementById("tempo");
const tempoValue = document.getElementById("tempoValue");
const status = document.getElementById("status");

tempoSlider.addEventListener("input", function () {
  tempoValue.textContent = tempoSlider.value + " BPM";

  // secondsPerBeat = 60 / tempoSlider.value;
  console.log(secondsPerBeat);

  if (isPlaying) {
    // clearInterval(metronomeInterval);
    // nextNoteTime = audioContext.currentTime;
    // scheduleBeep(nextNoteTime);
    // metronomeInterval = setInterval(scheduleBeep, secondsPerBeat * 1000);
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
const tapBtn = document.getElementById("tapBtn");

function Beep(time) {
  const osc = audioContext.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(1000, time);
  osc.connect(audioContext.destination);
  osc.start(time);
  osc.stop(time + 0.1); // stop after 100ms
}

function scheduleBeep() {
  // Implementation for scheduling beep
  Beep(nextNoteTime);
  flashBob(nextNoteTime);
  moveBob(nextNoteTime);
  nextNoteTime += secondsPerBeat;
}

// startBtn.addEventListener("click", function () {
//   // create audio context here
//   console.log("Start button clicked");
//   if (isPlaying) {
//     return;
//   }
//   isPlaying = true;
//   audioContext.resume();
//   // secondsPerBeat = 60 / tempoSlider.value;
//   console.log(secondsPerBeat);
//   // nextNoteTime = audioContext.currentTime;
//   // scheduleBeep(nextNoteTime);
//   // //   for (let i = 0; i < 4; i++) {
//   // //     Beep(nextNoteTime);
//   // //     nextNoteTime += secondsPerBeat;
//   // //   }
//   // metronomeInterval = setInterval(scheduleBeep, secondsPerBeat * 1000);
//   runMetronome();
//   status.textContent = "Playing";
// });

// stopBtn.addEventListener("click", function () {
//   console.log("Stop button clicked");
//   clearInterval(metronomeInterval);
//   isPlaying = false;
//   bob.classList.remove("moving");
//   status.textContent = "Stopped";
//   // stop the metronome here
// });

tapBtn.addEventListener("click", function () {
  console.log("Tap button clicked");
  // implement tap tempo functionality here
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
    // const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const newTempo = 60 / averageInterval;
    tempoSlider.value = newTempo;
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
