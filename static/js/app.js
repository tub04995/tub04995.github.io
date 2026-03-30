const audioContext = new AudioContext();
let isPlaying = false;
let secondsPerBeat;
let nextNoteTime;
// let metronomeInterval;
const tempoSlider = document.getElementById("tempo");
const tempoValue = document.getElementById("tempoValue");

tempoSlider.addEventListener("input", function () {
  tempoValue.textContent = tempoSlider.value + " BPM";
});

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
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
  nextNoteTime += secondsPerBeat;
}

startBtn.addEventListener("click", function () {
  // create audio context here
  console.log("Start button clicked");

  secondsPerBeat = 60 / tempoSlider.value;
  console.log(secondsPerBeat);
  nextNoteTime = audioContext.currentTime;
  scheduleBeep(nextNoteTime);
  //   for (let i = 0; i < 4; i++) {
  //     Beep(nextNoteTime);
  //     nextNoteTime += secondsPerBeat;
  //   }
  setInterval(scheduleBeep, secondsPerBeat * 1000);
});

stopBtn.addEventListener("click", function () {
  console.log("Stop button clicked");
  // stop the metronome here
});

tapBtn.addEventListener("click", function () {
  console.log("Tap button clicked");
  // implement tap tempo functionality here
});
