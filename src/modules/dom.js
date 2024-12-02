import Task from "./task";

export function handleTaskInput(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  event.target.reset();
  const formDataObj = Object.fromEntries(formData);
  const task = Task.create(formDataObj);
  Task.addToList(task);
  renderTasks();
}

export function renderTasks(list) {
  const tasksContainer = document.querySelector('.tasks-container');
  for (let element of tasksContainer.children) {
    while (element.firstElementChild) {
      element.firstElementChild.remove();
    }
  }
  
  const activeTasks = document.querySelector('#active-tasks');

  const completedTasks = document.querySelector('#completed-tasks');
  const summary = document.createElement('summary');
  summary.textContent = 'Completed Tasks';
  completedTasks.appendChild(summary);

  for (let [index, task] of Task.list.entries()) {
    const taskElement = document.createElement('div');
    taskElement.classList.add("task");
    taskElement.setAttribute('data-index', index);

    const completeButton = document.createElement('input');
    completeButton.setAttribute('type', 'checkbox');
    completeButton.id = `task-${index}`;
    (task.isComplete) ? completeButton.checked = true : completeButton.checked = false;
    taskElement.appendChild(completeButton);
    completeButton.addEventListener('change', updateTaskStatus);

    const taskTitle = document.createElement('label');
    taskTitle.textContent = task.title;
    taskTitle.setAttribute('for', `task-${index}`);
    (task.isComplete) ? taskTitle.style.textDecorationLine = "line-through": taskTitle.style.textDecorationLine = "none";
    taskTitle.style.userSelect = "none";
    taskElement.appendChild(taskTitle);

    if (!task.isComplete) {
      activeTasks.appendChild(taskElement)
    } else {
      completedTasks.appendChild(taskElement);
    }
  }
}

function updateTaskStatus(e) {
  const taskNumber = e.target.parentElement.dataset.index;
  Task.updateStatus(taskNumber);
  renderTasks();
}