let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const input = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("priorityInput");
  const taskText = input.value.trim();
  const priority = prioritySelect.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    done: false,
    timestamp: new Date().toLocaleString(),
    priority: priority
  };

  tasks.push(task);
  input.value = "";
  prioritySelect.value = "Low";
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

    li.innerHTML = `
      ${task.text}
      <span class="priority ${task.priority}">[${task.priority}]</span>
      <div class="timestamp">${task.timestamp}</div>
      <button class="delete-btn" onclick="deleteTask(${tasks.indexOf(task)})">X</button>
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
