let tasks = [];
// task.progress = "started"; // or "in-progress", or "completed"


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored).map(task => {
      if (!task.progress) task.progress = "started";
      return task;
    });
  }
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (taskInput.value.trim() === "") return;

  const task = {
  text: taskInput.value.trim(),
  done: false,
  progress: "started", // initial progress state
  priority,
  dueDate,
  timestamp: new Date().toLocaleString(),
};

  

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  const newText = prompt("Edit task text:", task.text);
  if (newText === null || newText.trim() === "") return;

  const newPriority = prompt("Edit priority (Low, Medium, High):", task.priority);
  if (!["Low", "Medium", "High"].includes(newPriority)) return;

  const newDueDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate || "");
  const newProgress = prompt("Progress (started, in-progress, completed):", task.progress);
  if (["started", "in-progress", "completed"].includes(newProgress)) {
    task.progress = newProgress;
  }


  task.text = newText.trim();
  task.priority = newPriority;
  task.dueDate = newDueDate;

  saveTasks();
  renderTasks();
}

function toggleTaskDone(index) {
  const task = tasks[index];
  task.done = !task.done;

  // Sync progress with checkbox
  task.progress = task.done ? "completed" : "in-progress";

  saveTasks();
  renderTasks();
}


function filterTasks() {
  const filter = document.getElementById("filterPriority").value;
  renderTasks(filter);
}

function renderTasks(filter = "All") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  let filteredTasks = tasks;
  if (filter !== "All") {
    filteredTasks = tasks.filter((task) => task.priority === filter);
  }
  // Sort by priority: High > Medium > Low
  filteredTasks.sort((a, b) => {
    const order = { High: 3, Medium: 2, Low: 1 };
    return order[b.priority] - order[a.priority];
  });

//   // Sort by due date
//   filteredTasks.sort((a, b) => {
//   const order = { High: 3, Medium: 2, Low: 1 };
//   const priorityDiff = order[b.priority] - order[a.priority];

//   if (priorityDiff !== 0) return priorityDiff;

//   // Compare due dates
//   if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
//   if (a.dueDate) return -1;
//   if (b.dueDate) return 1;
//   return 0;
// });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const isOverdue = task.dueDate && !task.done && task.dueDate < today;
    if (isOverdue) {
      li.classList.add("overdue");
    }

    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" ${task.done ? "checked" : ""} onclick="toggleTaskDone(${tasks.indexOf(task)})">
        <div class="task-text">
          <span class="${task.done ? 'done-text' : ''}">${task.text}</span>
          <span class="priority ${task.priority}">[${task.priority}]</span>
          ${task.dueDate ? `<div class="timestamp">Due: ${task.dueDate}${isOverdue ? ' <i class="fas fa-triangle-exclamation" style="color:red;"></i> Overdue' : ""}</div>` : ""}
          <div class="timestamp">Added: ${task.timestamp}</div>
          
          <!-- Progress Bar -->
          <div class="task-progress-bar">
            <div class="task-progress-fill ${task.progress}"></div>
          </div>
          <div class="progress-label">${task.progress}</div>

          <!-- Progress Dropdown -->
          <div class="progress-control">
            <label for="progress-${index}">Progress:</label>
            <select id="progress-${index}" onchange="updateProgress(${index}, this.value)">
              <option value="started" ${task.progress === "started" ? "selected" : ""}>Started</option>
              <option value="in-progress" ${task.progress === "in-progress" ? "selected" : ""}>In Progress</option>
              <option value="completed" ${task.progress === "completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
        </div>

        <div class="task-actions">
          <button class="edit-btn" onclick="editTask(${tasks.indexOf(task)})"><i class="fas fa-pen"></i></button>
          <button class="delete-btn" onclick="deleteTask(${tasks.indexOf(task)})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;


    list.appendChild(li);
  });

  updateProgressBar();
}

function updateProgressBar() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;

  let progress = 0;
  if (total > 0) {
    progress = (completed / total) * 100;
  }

  const fill = document.getElementById("progressFill");
  fill.style.width = `${progress}%`;

  if (progress === 100) {
    fill.style.backgroundColor = "#4caf50"; // Green
  } else if (progress >= 50) {
    fill.style.backgroundColor = "#ff9800"; // Orange
  } else {
    fill.style.backgroundColor = "#f44336"; // Red
  }
}

// update progress bar for each task
function updateProgress(index, newProgress) {
  const task = tasks[index];
  task.progress = newProgress;

  // Optional: if progress is "completed", also mark done
  task.done = newProgress === "completed";

  saveTasks();
  renderTasks();
}


// Initialize
loadTasks();
renderTasks();
