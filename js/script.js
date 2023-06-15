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

let pomodoroDuration = parseFloat(localStorage.getItem("pomodoroDuration")) || 25;
let shortBreakDuration = parseFloat(localStorage.getItem("shortBreakDuration")) || 5;
let longBreakDuration = parseFloat(localStorage.getItem("longBreakDuration")) || 15;
let intervalPomodoroCount = parseInt(localStorage.getItem("intervalPomodoroCount")) || 4;

document.addEventListener("DOMContentLoaded", function () {
  updatePomodoroLocalStorage();
  updateTimerDisplay(pomodoroDuration * 60);
  checkInputsSettings();
});

// Pomodoro timer

function startTimer(duration, itemId) {
  let timer = duration * 60;

  timerInterval = setInterval(function () {
    updateTimerDisplay(timer);

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
      updateTimerDisplay(pomodoroDuration * 60);
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
      updateTimerDisplay(shortBreakDuration * 60);
      timeRemaining = shortBreakDuration;
      timerTitle.textContent = "Short Break";
      setActiveTimer("pomodoro");
      break;
    case "longBreak":
      updateTimerDisplay(longBreakDuration * 60);
      timeRemaining = longBreakDuration;
      timerTitle.textContent = "Long Break";
      setActiveTimer("pomodoro");
      break;
    default:
      updateTimerDisplay(pomodoroDuration * 60);
      timeRemaining = pomodoroDuration;
      pomodoroCount = 0;
      timerTitle.textContent = "Pomodoro";
      setActiveTimer("shortBreak");
      break;
  }
}

function handleStart() {
  if (timeRemaining > 0) {
    const activeItemId = getActiveTaskFromLocalStorage();
    if (isFirstStart) {
      updateTimerDisplay(pomodoroDuration * 60);
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
    if (activeItemId) {
      startTimer(timeRemaining, activeItemId);
    } else {
      startTimer(timeRemaining);
    }
    startBtn.style.display = "none";
    pauseBtn.style.display = "block";
    resetBtn.style.display = "block";
  }
}

function updateTimerDisplay(timer) {
  const minutes = Math.floor(timer / 60);
  const seconds = Math.ceil(timer % 60);

  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");
}

function setActiveTimer(timer) {
  activeTimer = timer;
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

function checkInputsSettings() {
  const pomodoroValue = parseFloat(pomodoroInput.value);
  const shortBreakValue = parseFloat(shortBreakInput.value);
  const longBreakValue = parseFloat(longBreakInput.value);
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
  timeRemaining = pomodoroDuration;
  pomodoroCount = 0;
  setActiveTimer("pomodoro");

  pomodoroInput.value = pomodoroDuration;
  shortBreakInput.value = shortBreakDuration;
  longBreakInput.value = longBreakDuration;
  intervalInput.value = intervalPomodoroCount;
}

pomodoroInput.addEventListener("input", checkInputsSettings);
shortBreakInput.addEventListener("input", checkInputsSettings);
longBreakInput.addEventListener("input", checkInputsSettings);
intervalInput.addEventListener("input", checkInputsSettings);

okButton.addEventListener("click", function () {
  if (!isNaN(parseFloat(pomodoroInput.value))) {
    pomodoroDuration = parseFloat(pomodoroInput.value);
    localStorage.setItem("pomodoroDuration", pomodoroDuration.toString());
  }
  if (!isNaN(parseFloat(shortBreakInput.value))) {
    shortBreakDuration = parseFloat(shortBreakInput.value);
    localStorage.setItem("shortBreakDuration", shortBreakDuration.toString());
  }
  if (!isNaN(parseFloat(longBreakInput.value))) {
    longBreakDuration = parseFloat(longBreakInput.value);
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
  checkInputsSettings();
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

    const activeTaskId = getActiveTaskFromLocalStorage();
    if (activeTaskId) {
      const activeTask = document.getElementById(activeTaskId);
      activeTask.classList.add("active");
    }
  }

  checkAddTaskInputs();
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

function updateTasksLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".todo__item"));

  const taskData = tasks.map((task) => ({
    id: task.id,
    text: task.querySelector(".todo__update-input").value,
    completed: task.classList.contains("completed"),
    completedPomodoros: parseInt(task.querySelector('.todo__completed-pomodoros').textContent),
    selectedPomodors: parseInt(task.querySelector('.todo__selected-pomodors').value),
  }));

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

function saveActiveTaskToLocalStorage(taskId) {
  localStorage.setItem("activeTask", taskId);
}

function getActiveTaskFromLocalStorage() {
  return localStorage.getItem("activeTask");
}

function checkAddTaskInputs() {
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

function checkEditTaskInputs(id) {
  const selectedPomodorsInput = document.getElementById(`selectedPomodors_${id}`);
  const saveTaskButton = document.getElementById(`saveTask_${id}`);
  const taskInput = document.querySelector(`#task_${id}`);

  const selectedPomodorsValue = parseInt(selectedPomodorsInput.value);
  const isPomodorsEmpty = isNaN(selectedPomodorsValue) || selectedPomodorsValue <= 0;
  const isTextEmpty = taskInput.value.trim() === "";

  saveTaskButton.disabled = isPomodorsEmpty || isTextEmpty;

  if (saveTaskButton.disabled) {
    saveTaskButton.classList.add("disabled");
  } else {
    saveTaskButton.classList.remove("disabled");
  }
}

pomodoroCountTask.addEventListener("input", checkAddTaskInputs);
taskInput.addEventListener("input", checkAddTaskInputs);

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
  const taskText = document.getElementById(`task_${taskId}`);

  if (checkbox.checked) {
    taskText.style.textDecoration = "line-through";
    taskItem.classList.add("completed");
  } else {
    taskText.style.textDecoration = "none";
    taskItem.classList.remove("completed");
  }

  saveTasksToLocalStorage();
}

let previousInputTextValue = '';
let previousInputSelectedPomodoros = '';

function handleEditBtnClick(id) {
  const allItems = todoList.querySelectorAll("li");

  allItems.forEach((item) => {
    item.classList.remove("active");
    localStorage.removeItem("activeTask");
  });

  const editBtnTask = document.getElementById(`editTask_${id}`);
  const removeBtnTask = document.getElementById(`removeTask_${id}`);
  const taskInput = document.getElementById(`task_${id}`);
  const itemUpdateContainer = document.querySelector(`[id="${id}"] .todo__item-updateContainer`);

  editBtnTask.classList.add("hidden");
  removeBtnTask.classList.remove("hidden");
  taskInput.removeAttribute("readonly");
  taskInput.classList.remove("todo__input-read");
  taskInput.classList.add("todo__update-input");
  itemUpdateContainer.classList.remove("hidden");
  itemUpdateContainer.style.marginTop = "30px";

  previousInputTextValue = taskInput.value;

  const pomodoroCounterSpan = document.getElementById(`pomodoroCounter_${id}`);
  const completedPomodorosSpan = document.getElementById(`completedPomodoros_${id}`);
  const completedPomodoros = parseInt(pomodoroCounterSpan.textContent.split("/")[0]);
  const selectedPomodorsInput = document.getElementById(`selectedPomodors_${id}`);
  const selectedPomodors = parseInt(selectedPomodorsInput.value);

  completedPomodorosSpan.textContent = `${completedPomodoros} /`;

  previousInputSelectedPomodoros = selectedPomodors;

  selectedPomodorsInput.addEventListener("input", function () {
    checkEditTaskInputs(id);
  });

  taskInput.addEventListener("input", function () {
    checkEditTaskInputs(id);
  });
}

function handleSaveBtnClick(id) {
  const selectedPomodorsInput = document.getElementById(`selectedPomodors_${id}`);
  const selectedPomodors = parseInt(selectedPomodorsInput.value);
  const pomodoroCounterSpan = document.getElementById(`pomodoroCounter_${id}`);
  const completedPomodoros = parseInt(pomodoroCounterSpan.textContent.split("/")[0]);

  pomodoroCounterSpan.textContent = `${completedPomodoros}/${selectedPomodors}`;

  updateTasksLocalStorage();

  const editBtnTask = document.getElementById(`editTask_${id}`);
  const removeBtnTask = document.getElementById(`removeTask_${id}`);
  const taskInput = document.getElementById(`task_${id}`);
  const itemUpdateContainer = document.querySelector(`[id="${id}"] .todo__item-updateContainer`);

  taskInput.classList.add("todo__input-read");
  taskInput.classList.remove("todo__update-input");
  itemUpdateContainer.classList.add("hidden");
  removeBtnTask.classList.add("hidden");
  editBtnTask.classList.remove("hidden");
  
  selectedPomodorsInput.addEventListener("input", function () {
    checkEditTaskInputs(id);
  });

  taskInput.addEventListener("input", function () {
    checkEditTaskInputs(id);
  });
}

function handleCancelBtnClick(id) {
  const taskInput = document.getElementById(`task_${id}`);
  const editBtnTask = document.getElementById(`editTask_${id}`);
  const removeBtnTask = document.getElementById(`removeTask_${id}`);
  const itemUpdateContainer = document.querySelector(`[id="${id}"] .todo__item-updateContainer`);
  const selectedPomodorsInput = document.getElementById(`selectedPomodors_${id}`);

  taskInput.classList.add("todo__input-read");
  taskInput.classList.remove("todo__update-input");
  editBtnTask.classList.remove("hidden");
  removeBtnTask.classList.add("hidden");

  taskInput.setAttribute("readonly", true);

  taskInput.value = previousInputTextValue;

  selectedPomodorsInput.value = previousInputSelectedPomodoros;

  itemUpdateContainer.classList.add("hidden");
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
      <div class="todo__item-mainContainer">
        <div class="todo__item-container">
          <input id="taskCheckbox_${id}" type="checkbox" class="todo__checkbox"${completed ? " checked" : ""}>
          <input id="task_${id}" type="text" class="todo__input-read todo__input" value="${text}" readonly>
          <span id="pomodoroCounter_${id}" class="todo__counter" data-selected-pomodors="${selectedPomodors}">${completedPomodoros}/${selectedPomodors}</span>
        </div>
        <button id="editTask_${id}" class="todo__edit"><img class="todo__edit-img" src="../assets/img/setting.svg" alt="Редактировать"></button>
        <span id="removeTask_${id}" class="close hidden">&times;</span>
      </div>
      <div class="todo__item-updateContainer hidden">
        <div>
          <span id="completedPomodoros_${id}" class="todo__completed-pomodoros">${completedPomodoros}/</span>
          <input id="selectedPomodors_${id}" type="number" class="todo__selected-pomodors" min="0" value="${selectedPomodors}">
        </div>
        <div>
          <button id="saveTask_${id}" class="todo__save">Сохранить</button>
          <button id="cancelTask_${id}" class="todo__cancel">Отменить</button>
        </div>
      </div>
    </li>
  `;
  todoList.insertAdjacentHTML("beforeend", taskItem);

  const checkbox = document.getElementById(`taskCheckbox_${id}`);
  const editBtnTask = document.getElementById(`editTask_${id}`);
  const cancelBtnTask = document.getElementById(`cancelTask_${id}`);
  const saveBtnTask = document.getElementById(`saveTask_${id}`);
  const selectedPomodorsInput = document.getElementById(`selectedPomodors_${id}`);

  checkAddTaskInputs();

  checkbox.addEventListener("change", function () {
    toggleTaskCompletion(id);
  });

  editBtnTask.addEventListener("click", function () {
    handleEditBtnClick(id);
  });

  saveBtnTask.addEventListener("click", function () {
    handleSaveBtnClick(id);
  });

  cancelBtnTask.addEventListener("click", function () {
    handleCancelBtnClick(id);
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
  const editBtnTask = event.target.closest(".todo__edit");
  const saveBtnTask = event.target.closest(".todo__save");
  const cancelBtnTask = event.target.closest(".todo__cancel");
  const checkboxTask = event.target.classList.contains("todo__checkbox");

  if (target && !checkboxTask && !editBtnTask && !saveBtnTask && !cancelBtnTask) {
    const isActive = target.classList.contains("active");
    const itemUpdateContainer = target.querySelector(".todo__item-updateContainer");

    if (!itemUpdateContainer || itemUpdateContainer.classList.contains("hidden")) {
      if (isActive) {
        target.classList.remove("active");
        localStorage.removeItem("activeTask");
      } else {
        const allItems = todoList.querySelectorAll("li");

        allItems.forEach((item) => {
          item.classList.remove("active");
        });

        target.classList.add("active");
        saveActiveTaskToLocalStorage(target.id);
      }
    }
  }
});