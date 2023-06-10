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
const modalSettings = document.querySelector("#modalSettings");
const closeDescription = document.querySelector("#closeDescription");
const btnDescription = document.querySelector("#btnDescription");
const btnSettings = document.querySelector("#btnSettings");

const pomodoroInput = document.querySelector("#pomodoroInput");
const shortBreakInput = document.querySelector("#shortBreakInput");
const longBreakInput = document.querySelector("#longBreakInput");
const intervalInput = document.querySelector("#intervalInput");
const resetOriginalButton = document.querySelector("#resetOriginalButton");
const okButton = document.querySelector("#okButton");

let timerInterval;
let timeRemaining = 0;
let activeTimer;
let pomodoroCount = 0;

let pomodoroDuration = parseInt(localStorage.getItem("pomodoroDuration")) || 25;
let shortBreakDuration =
  parseInt(localStorage.getItem("shortBreakDuration")) || 5;
let longBreakDuration =
  parseInt(localStorage.getItem("longBreakDuration")) || 15;
let intervalPomodoroCount =
  parseInt(localStorage.getItem("intervalPomodoroCount")) || 4;

document.addEventListener("DOMContentLoaded", function () {
  updateDataFromLocalStorage();
  checkInputs();
});

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
      setTimeDisplay(pomodoroDuration.toString().padStart(2, "0"), "00");
      timeRemaining = pomodoroDuration;
      pomodoroCount++;
      if (pomodoroCount === intervalPomodoroCount) {
        setActiveTimer("longBreak");
        pomodoroCount = 0;
      } else {
        setActiveTimer("shortBreak");
      }
      break;
    case "shortBreak":
      setTimeDisplay(shortBreakDuration.toString().padStart(2, "0"), "00");
      timeRemaining = shortBreakDuration;
      setActiveTimer("pomodoro");
      break;
    case "longBreak":
      setTimeDisplay(longBreakDuration.toString().padStart(2, "0"), "00");
      timeRemaining = longBreakDuration;
      setActiveTimer("pomodoro");
      break;
    default:
      setTimeDisplay(pomodoroDuration.toString().padStart(2, "0"), "00");
      timeRemaining = pomodoroDuration;
      pomodoroCount = 0;
      setActiveTimer("pomodoro");
  }
}

function handleStart() {
  if (!activeTimer) {
    setActiveTimer("pomodoro");
    timeRemaining = pomodoroDuration;
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

btnSettings.addEventListener("click", function () {
  modalSettings.style.display = "block";
});

closeDescription.addEventListener("click", function () {
  modalDescription.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target == modalDescription) {
    modalDescription.style.display = "none";
  }
});

function checkInputs() {
  const pomodoroValue = parseInt(pomodoroInput.value);
  const shortBreakValue = parseInt(shortBreakInput.value);
  const longBreakValue = parseInt(longBreakInput.value);
  const intervalValue = parseInt(intervalInput.value);

  const hasEmptyInput =
    isNaN(pomodoroValue) ||
    isNaN(shortBreakValue) ||
    isNaN(longBreakValue) ||
    isNaN(intervalValue);

  const hasNegativeInput =
    pomodoroValue <= 0 ||
    shortBreakValue <= 0 ||
    longBreakValue <= 0 ||
    intervalValue <= 0;

  okButton.disabled = hasEmptyInput || hasNegativeInput;
  if (okButton.disabled) {
    okButton.classList.add("disabled");
  } else {
    okButton.classList.remove("disabled");
  }
}

function updateDataFromLocalStorage() {
  setTimeDisplay(pomodoroDuration.toString().padStart(2, "0"), "00");
  timeRemaining = pomodoroDuration;
  pomodoroCount = 0;
  setActiveTimer("pomodoro");

  pomodoroInput.value = pomodoroDuration;
  shortBreakInput.value = shortBreakDuration;
  longBreakInput.value = longBreakDuration;
  intervalInput.value = intervalPomodoroCount;
}

pomodoroInput.addEventListener("input", checkInputs);
shortBreakInput.addEventListener("input", checkInputs);
longBreakInput.addEventListener("input", checkInputs);
intervalInput.addEventListener("input", checkInputs);

okButton.addEventListener("click", function () {
  if (!isNaN(parseInt(pomodoroInput.value))) {
    pomodoroDuration = parseInt(pomodoroInput.value);
    localStorage.setItem("pomodoroDuration", pomodoroDuration.toString());
  }
  if (!isNaN(parseInt(shortBreakInput.value))) {
    shortBreakDuration = parseInt(shortBreakInput.value);
    localStorage.setItem("shortBreakDuration", shortBreakDuration.toString());
  }
  if (!isNaN(parseInt(longBreakInput.value))) {
    longBreakDuration = parseInt(longBreakInput.value);
    localStorage.setItem("longBreakDuration", longBreakDuration.toString());
  }
  if (!isNaN(parseInt(intervalInput.value))) {
    intervalPomodoroCount = parseInt(intervalInput.value);
    localStorage.setItem(
      "intervalPomodoroCount",
      intervalPomodoroCount.toString()
    );
  }

  resetTimer();
  modalSettings.style.display = "none";
});

resetOriginalButton.addEventListener("click", function () {
  pomodoroInput.value = 25;
  shortBreakInput.value = 5;
  longBreakInput.value = 15;
  intervalInput.value = 4;
});

// ToDo List

const taskInput = document.querySelector("#taskInput");
const todoList = document.querySelector("#todoList");
const addTaskButton = document.querySelector("#addTaskButton");
const removeTask = document.querySelector("#removeTask");

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

addTaskButton.addEventListener("click", function () {
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const taskData = JSON.parse(savedTasks);
    taskData.forEach((task) => {
      addTask(task.text);
      const taskItem = document.getElementById(task.id);
      const checkbox = document.getElementById(`taskCheckbox_${task.id}`);
      const todoItem = document.getElementById(`todoItem_${task.id}`);
      if (task.completed) {
        taskItem.classList.add("completed");
        checkbox.checked = true;
        todoItem.classList.add("completed");
      }
    });
  }
});

function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".todo__item"));

  const taskData = tasks.map((task) => ({
    id: task.id,
    text: task.querySelector(".todo__input").value,
    completed: task.classList.contains("completed"),
  }));

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

let taskIdCounter = 0;
function addTask(taskText) {
  const taskId = `task_${taskIdCounter++}`;

  const taskItem = `
      <li id="todoItem_${taskId}" class="todo__item">
          <div class="todo__item-container">
            <input id="taskCheckbox_${taskId}" type="checkbox" class="todo__checkbox">
            <input id="${taskId}" type="text" class="todo__input-read todo__input" value="${taskText}" readonly>
          </div>
          <span id="removeTask" class="close">&times;</span>
      </li>
  `;
  todoList.insertAdjacentHTML("beforeend", taskItem);

  const taskLabel = document.querySelector(`#${taskId}`);
  const checkbox = document.querySelector(`#taskCheckbox_${taskId}`);
  const todoItem = document.querySelector(`#todoItem_${taskId}`);

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      taskLabel.classList.add("completed");
      todoItem.classList.add("completed");
    } else {
      taskLabel.classList.remove("completed");
      todoItem.classList.remove("completed");
    }

    saveTasksToLocalStorage();
  });

  taskLabel.addEventListener("click", function () {
    this.removeAttribute("readonly");
    this.focus();
  });

  taskLabel.addEventListener("blur", function () {
    this.setAttribute("readonly", true);
    saveTasksToLocalStorage();
  });

  taskLabel.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      this.setAttribute("readonly", true);
      saveTasksToLocalStorage();
    }
  });

  saveTasksToLocalStorage();
}

todoList.addEventListener("click", function (event) {
  if (event.target.id === "removeTask") {
    const taskItem = event.target.parentNode;
    taskItem.remove();
    saveTasksToLocalStorage();
  }
});
