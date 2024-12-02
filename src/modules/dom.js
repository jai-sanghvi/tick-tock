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
  if (tasksContainer.firstElementChild) {
    tasksContainer.firstElementChild.remove();
  }
  
  const innerContainer = document.createElement('div');


  for (let [index, task] of Task.list.entries()) {
    if (!task.isComplete) {
      const taskElement = document.createElement('div');
      taskElement.classList.add("task");
      taskElement.setAttribute('data-index', index);
  
      const completeButton = document.createElement('input');
      completeButton.setAttribute('type', 'checkbox');
      completeButton.id = `task-${index}`;
      taskElement.appendChild(completeButton);
      completeButton.addEventListener('change', updateTaskStatus);
  
      const taskTitle = document.createElement('label');
      taskTitle.textContent = task.title;
      taskTitle.setAttribute('for', `task-${index}`);
      taskElement.appendChild(taskTitle);
  
      innerContainer.appendChild(taskElement);
    }
  }

  tasksContainer.appendChild(innerContainer);
}

function updateTaskStatus(e) {
  const taskNumber = e.target.parentElement.dataset.index;
  Task.complete(taskNumber);
  renderTasks();
}