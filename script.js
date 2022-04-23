const clueHoldTime = 1000; //clue play/light time
const cluePauseTime = 333 //time between clues
const nextClueWaitTime = 1000; //wait before playing sequence of clues

var pattern = new Array(8);
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var strikes;
var countdown;
var temp;

function startGame() {
  gamePlaying = true;
  document.getElementById("timeOptions").style.visibility = "hidden";
  
  generatePattern();
  strikes = 0;
  progress = 0;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function getRandomNonZeroInt(max) {
  return Math.floor((Math.random() * max) + 1);
}

function generatePattern() {
  for (let j=0; j < 8; j++){
    pattern[j] = getRandomNonZeroInt(4);
  }
}

function stopGame() {
  for(let i=0; i<100; i++){
    window.clearInterval(i);
  }
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("timeOptions").style.visibility = "visible";
  document.getElementById("timeDisplay").innerHTML = "";
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  
  setTimeout(CDTimer, delay - 1000);
}
             
function CDTimer(){
  setInterval(function(){
    temp -= 1000;
    if (temp == 0){
      for(let i=0; i<100; i++){
        window.clearInterval(i);
      }
      strikes++;
      alert("Time expired! Strike " + strikes + "/3");
      if (strikes == 3){
        loseGame();
        return;
      }
      temp = countdown;
      document.getElementById("timeDisplay").innerHTML = ((countdown/1000)-1) + " s";
      playClueSequence();
      return;
    }
    document.getElementById("timeDisplay").innerHTML = (temp/1000) + " s";
  }, 1000)
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  for(let i=0; i<100; i++){
     window.clearInterval(i);
  }
  alert("Congratulations! You Won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // add game logic here
  if (!(btn == pattern[guessCounter])){
    for(let i=0; i<100; i++){
        window.clearInterval(i);
      }
    strikes++;
    alert("Incorrect! Strike " + strikes + "/3");
    if (strikes == 3){
      loseGame();
      return;
    } else {
      temp = countdown;
      document.getElementById("timeDisplay").innerHTML = ((countdown/1000)-1) + " s";
      playClueSequence();
      return;
    }
  }
  
  if (guessCounter == progress){
    for(let i=0; i<100; i++){
        window.clearInterval(i);
      }
    if (progress == pattern.length - 1){
      winGame();
      return;
    }
    temp = countdown;
    document.getElementById("timeDisplay").innerHTML = ((countdown/1000)-1) + " s";
    progress++;
    playClueSequence();
  } else {
    guessCounter++;
  }
}

function start1() {
  countdown = 0;
  temp = 0;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("timeDisplay").style.visibility = "hidden";
  
}
function start2() {
  countdown = 11000;
  temp = 11000
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("timeDisplay").style.visibility = "visible";
}
function start3() {
  countdown = 6000;
  temp = 6000;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("timeDisplay").style.visibility = "visible";
}
function start4() {
  countdown = 3000;
  temp = 3000;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("timeDisplay").style.visibility = "visible";
}