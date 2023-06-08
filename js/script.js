const alarmSound = new Audio("../assets/music/Alarm.mp3");

const pomodoroBtn = document.querySelector("#pomodoroBtn");
const shortBreakBtn = document.querySelector("#shortBreakBtn");
const longBreakBtn = document.querySelector("#longBreakBtn");
const startBtn = document.querySelector("#btn-start");
const pauseBtn = document.querySelector("#btn-pause");
const resetBtn = document.querySelector("#btn-reset");
const minutesDisplay = document.querySelector("#minutes");
const secondsDisplay = document.querySelector("#seconds");

const modalDescription = document.querySelector("#modalDescription");
const closeModal = document.querySelector(".close");
const btnDescription = document.querySelector("#btnDescription");
const btnSettings = document.querySelector("#btnSettings");

let timerInterval;
let timeRemaining = 0;
let activeTimer;
let pomodoroCount = 0;

// Pomodoro timer

function startTimer(duration) {
  let timer = duration * 60;

  timerInterval = setInterval(function () {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    minutesDisplay.textContent = minutes.toString().padStart(2, "0");
    secondsDisplay.textContent = seconds.toString().padStart(2, "0");

    if (--timer < 0) {
      clearInterval(timerInterval);
      alarmSound.play();

      setTimeout(function () {
        alert("Таймер завершился!");
        resetTimer();
        handleStart();
      }, 1000);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);

  switch (activeTimer) {
    case "pomodoro":
      setTimeDisplay("25", "00");
      timeRemaining = 25;
      pomodoroCount++;
      if (pomodoroCount === 4) {
        setActiveTimer("longBreak");
        pomodoroCount = 0;
      } else {
        setActiveTimer("shortBreak");
      }
      break;
    case "shortBreak":
      setTimeDisplay("01", "00");
      timeRemaining = 1;
      setActiveTimer("pomodoro");
      break;
    case "longBreak":
      setTimeDisplay("15", "00");
      timeRemaining = 15;
      setActiveTimer("pomodoro");
      break;
    default:
      setTimeDisplay("25", "00");
      timeRemaining = 25;
      pomodoroCount = 0;
      setActiveTimer("pomodoro");
  }
}

function handleStart() {
  if (!activeTimer) {
    setActiveTimer("pomodoro");
    timeRemaining = 25;
    pomodoroCount++;
    setActiveTimer("shortBreak");
  }
  if (timeRemaining > 0) {
    startTimer(timeRemaining);
    startBtn.style.display = "none";
    pauseBtn.style.display = "block";
    resetBtn.style.display = "block";
  }
}

function setActiveTimer(timer) {
  activeTimer = timer;
}

function setTimeDisplay(minutes, seconds) {
  minutesDisplay.textContent = minutes;
  secondsDisplay.textContent = seconds;
}

function handleButtonStart() {
  clearInterval(timerInterval);
  startBtn.style.display = "block";
  pauseBtn.style.display = "none";
  resetBtn.style.display = "block";
  timeRemaining =
    parseInt(minutesDisplay.textContent) +
    parseInt(secondsDisplay.textContent) / 60;
}

function handleButtonReset() {
  startBtn.style.display = "block";
  pauseBtn.style.display = "none";
  resetBtn.style.display = "none";
  setActiveTimer("reset");
  resetTimer();
}

pomodoroBtn.addEventListener("click", function () {
  setActiveTimer("pomodoro");
  resetTimer();
});

shortBreakBtn.addEventListener("click", function () {
  setActiveTimer("shortBreak");
  resetTimer();
});

longBreakBtn.addEventListener("click", function () {
  setActiveTimer("longBreak");
  resetTimer();
});

startBtn.addEventListener("click", handleStart);

pauseBtn.addEventListener("click", handleButtonStart);

resetBtn.addEventListener("click", handleButtonReset);

// Modal windows

btnDescription.addEventListener("click", function () {
  modalDescription.style.display = "block";
});

closeModal.addEventListener("click", function () {
  modalDescription.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target == modalDescription) {
    modalDescription.style.display = "none";
  }
});
