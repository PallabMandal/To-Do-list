let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const input = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("priorityInput");
  const dueDateInput = document.getElementById("dueDateInput");

  const taskText = input.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    done: false,
    timestamp: new Date().toLocaleString(),
    priority: priority,
    dueDate: dueDate
  };

  tasks.push(task);
  input.value = "";
  prioritySelect.value = "Low";
  dueDateInput.value = "";
  saveTasks();
  renderTasks();
}


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const filter = document.getElementById("filterPriority").value;
  list.innerHTML = "";

  // Sort by priority (High > Medium > Low)
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  let filteredTasks = [...tasks];

  // Apply filter if not 'All'
  if (filter !== "All") {
    filteredTasks = filteredTasks.filter(task => task.priority === filter);
  }

  // Sort filtered tasks
  filteredTasks.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.done) {
      li.classList.add("done");
    }

    // Check for overdue (only if dueDate is set and not completed)
    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate && !task.done && task.dueDate < today;

    if (isOverdue) {
      li.classList.add("overdue");
    }

    li.innerHTML = `
      ${task.text}
      <span class="priority ${task.priority}">[${task.priority}]</span>
      ${task.dueDate ? `<div class="timestamp">Due: ${task.dueDate}${isOverdue ? ' <i class="fas fa-triangle-exclamation" style="color:red;"></i> Overdue' : ""}</div>` : ""}
      <div class="timestamp">Added: ${task.timestamp}</div>
      <button class="delete-btn" onclick="deleteTask(${tasks.indexOf(task)})">
        <i class="fas fa-trash-alt"></i>
      </button>

    `;

    li.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      }
    });

    list.appendChild(li);
  });

}



function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Initial render on page load
renderTasks();
