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

const timerTitle = document.querySelector("#timerTitle");

let timerInterval;
let timeRemaining = 0;
let activeTimer;
let pomodoroCount = 0;
let isFirstStart = true;

let pomodoroDuration = parseInt(localStorage.getItem("pomodoroDuration")) || 25;
let shortBreakDuration =
  parseInt(localStorage.getItem("shortBreakDuration")) || 5;
let longBreakDuration =
  parseInt(localStorage.getItem("longBreakDuration")) || 15;
let intervalPomodoroCount =
  parseInt(localStorage.getItem("intervalPomodoroCount")) || 4;

document.addEventListener("DOMContentLoaded", function () {
  updatePomodoroLocalStorage();
  checkInputs();
});

// Pomodoro timer

function startTimer(duration, itemId) {
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
        if (activeTimer === "pomodoro") {
          updateCompletedPomodoros(itemId);
        }
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
      timerTitle.textContent = "Pomodoro";
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
      timerTitle.textContent = "Short Break";
      setActiveTimer("pomodoro");
      break;
    case "longBreak":
      setTimeDisplay(longBreakDuration.toString().padStart(2, "0"), "00");
      timeRemaining = longBreakDuration;
      timerTitle.textContent = "Long Break";
      setActiveTimer("pomodoro");
      break;
    default:
      setTimeDisplay(pomodoroDuration.toString().padStart(2, "0"), "00");
      timeRemaining = pomodoroDuration;
      pomodoroCount = 0;
      timerTitle.textContent = "Pomodoro";
      setActiveTimer("pomodoro");
      break;
  }
  isTimerRunning = false;
}

function handleStart() {
  if (timeRemaining > 0) {
    const selectedItem = todoList.querySelector("li.active");
    if (isFirstStart) {
      setTimeDisplay(pomodoroDuration.toString().padStart(2, "0"), "00");
      timeRemaining = pomodoroDuration;
      pomodoroCount++;
      if (pomodoroCount === intervalPomodoroCount) {
        setActiveTimer("longBreak");
        pomodoroCount = 0;
      } else {
        setActiveTimer("shortBreak");
      }
      isFirstStart = false;
    }
    if (selectedItem) {
      startTimer(timeRemaining, selectedItem.id);
    } else {
      startTimer(timeRemaining);
    }
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

function updatePomodoroLocalStorage() {
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
const pomodoroCountTask = document.querySelector("#pomodoroCountTask");

document.addEventListener("DOMContentLoaded", function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const taskData = JSON.parse(savedTasks);
    taskData.forEach((task) => {
      addTask(
        task.id,
        task.text,
        task.completed,
        task.completedPomodoros,
        task.selectedPomodors
      );
    });
  }

  checkTaskInputs();
});

function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".todo__item"));

  const taskData = tasks.map((task) => ({
    id: task.id,
    text: task.querySelector(".todo__input").value,
    completed: task.classList.contains("completed"),
    completedPomodoros: parseInt(task.querySelector(".todo__counter").textContent.split("/")[0]),
    selectedPomodors: parseInt(task.querySelector(".todo__counter").getAttribute("data-selected-pomodors")),
  }));

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

function checkTaskInputs() {
  const pomodoroCountTaskValue = parseInt(pomodoroCountTask.value);

  const hasEmptyInput = isNaN(pomodoroCountTaskValue);
  const hasNegativeInput = pomodoroCountTaskValue <= 0;

  const isTextEmpty = taskInput.value.trim() === "";

  addTaskButton.disabled = hasEmptyInput || hasNegativeInput || isTextEmpty;

  if (addTaskButton.disabled) {
    addTaskButton.classList.add("disabled");
  } else {
    addTaskButton.classList.remove("disabled");
  }
}

pomodoroCountTask.addEventListener("input", checkTaskInputs);
taskInput.addEventListener("input", checkTaskInputs);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !addTaskButton.disabled) {
    const taskId = Date.now().toString();
    addTask(
      taskId,
      taskInput.value,
      false,
      0,
      parseInt(pomodoroCountTask.value)
    );
    taskInput.value = "";
    pomodoroCountTask.value = 1;
  }
});

addTaskButton.addEventListener("click", function () {
  const taskId = Date.now().toString();
  addTask(taskId, taskInput.value, false, 0, parseInt(pomodoroCountTask.value));
  taskInput.value = "";
  pomodoroCountTask.value = 1;
});

function toggleTaskCompletion(taskId) {
  const taskItem = document.getElementById(taskId);
  const checkbox = document.getElementById(`taskCheckbox_${taskId}`);
  const todoItem = document.getElementById(taskId);

  if (checkbox.checked) {
    taskItem.classList.add("completed");
    todoItem.classList.add("completed");
  } else {
    taskItem.classList.remove("completed");
    todoItem.classList.remove("completed");
  }

  saveTasksToLocalStorage();
}

function updateCompletedPomodoros(itemId) {
  const todoItem = document.getElementById(itemId);
  if (todoItem) {
    const counterElement = todoItem.querySelector(".todo__counter");
    const counterText = counterElement.textContent;
    const [completedPomodoros, selectedPomodoros] = counterText.split("/");
    const updatedCompletedPomodoros = parseInt(completedPomodoros) + 1;
    counterElement.textContent = `${updatedCompletedPomodoros}/${selectedPomodoros}`;
    saveTasksToLocalStorage();
  }
}

function addTask(id, text, completed, completedPomodoros, selectedPomodors) {
  const taskItem = `
    <li id="${id}" class="todo__item${completed ? " completed" : ""}">
      <div class="todo__item-container">
        <input id="taskCheckbox_${id}" type="checkbox" class="todo__checkbox"${completed ? " checked" : ""}>
        <input id="task_${id}" type="text" class="todo__input-read todo__input" value="${text}" readonly>
        <span id="pomodoroCounter_${id}" class="todo__counter" data-selected-pomodors="${selectedPomodors}">${completedPomodoros}/${selectedPomodors}</span>
      </div>
      <span id="removeTask_${id}" class="close">&times;</span>
    </li>
  `;
  todoList.insertAdjacentHTML("beforeend", taskItem);

  const checkbox = document.getElementById(`taskCheckbox_${id}`);

  checkbox.addEventListener("change", function () {
    toggleTaskCompletion(id);
  });

  saveTasksToLocalStorage();
}

todoList.addEventListener("click", function (event) {
  const targetId = event.target.id;

  if (targetId.startsWith("removeTask_")) {
    const taskId = targetId.replace("removeTask_", "");
    const taskItem = document.getElementById(taskId);
    taskItem.remove();
    saveTasksToLocalStorage();
  } else if (targetId.startsWith("taskCheckbox_")) {
    const taskId = targetId.replace("taskCheckbox_", "");
    toggleTaskCompletion(taskId);
  }

  const target = event.target.closest("li");

  if (target && !event.target.classList.contains("todo__checkbox")) {
    const isActive = target.classList.contains("active");

    if (isActive) {
      target.classList.remove("active");
    } else {
      const allItems = todoList.querySelectorAll("li");

      allItems.forEach((item) => {
        item.classList.remove("active");
      });

      target.classList.add("active");
    }
  }
});
