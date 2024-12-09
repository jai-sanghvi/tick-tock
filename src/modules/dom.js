import Task from "./task";

export function handleTaskInput(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  event.target.reset();
  const formDataObj = Object.fromEntries(formData);
  const task = Task.create(formDataObj);
  Task.addToList(task);
  renderTasks(formDataObj.list);
  renderCategories();
}

export function createCategoryInput() {
  const categoriesContainer = document.querySelector('#categories-container');

  const li = document.createElement('li');
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.value = "Untitled";

  form.appendChild(input);
  li.appendChild(form);
  categoriesContainer.appendChild(li);
  li.classList.add('temp-category');

  input.focus();
  input.select();
  
  input.addEventListener("blur", callBackFn);
  form.addEventListener("submit", callBackFn);

  function callBackFn(e) {
    if (e.type === 'submit') {e.preventDefault()};
    input.removeEventListener("blur", callBackFn);
    form.removeEventListener("submit", callBackFn);
    handleCategoryInput(input.value);
  }
}

function handleCategoryInput(categoryName) {
  
  if (categoryName !== '') {
    Task.addNewCategory(categoryName);
    changeCategory(categoryName);
  }
  
  renderCategories();
}

export function renderTasks(list = "default") {
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
    if (task.list === list) {
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
      taskElement.appendChild(taskTitle);

      const importanceButton = document.createElement('button');
      importanceButton.setAttribute('type', 'button');
      (task.isImportant) ? importanceButton.textContent = "Remove importance" : importanceButton.textContent = "Mark as important";
      taskElement.appendChild(importanceButton);
      importanceButton.addEventListener("click", updateImportance);

  
      if (!task.isComplete) {
        activeTasks.appendChild(taskElement);
      } else {
        completedTasks.appendChild(taskElement);
      }

      taskElement.addEventListener("click", (e) => {
        if (e.target === taskElement) viewTaskDetails(taskElement);
      });
    }
  }
}

export function renderCategories() {
  const categoriesContainer = document.querySelector('#categories-container');
  while (categoriesContainer.firstElementChild) {
    categoriesContainer.firstElementChild.remove();
  }

  const currentCategory = document.querySelector('input[type="hidden"][name="list"]').value;

  for (let category of Task.categories) {
    const li = document.createElement('li');
    li.textContent = category;
    li.setAttribute('data-category', category);
    li.style.position = 'relative';

    let tasksInCurrentCategory = 0;
    const tasksList = Task.list;
    for (let task of tasksList) {
      task.list === category ? tasksInCurrentCategory++ : null;
    }
    if (tasksInCurrentCategory > 0) {
      const span = document.createElement('span');
      span.textContent = tasksInCurrentCategory;
      li.appendChild(span);
    }

    categoriesContainer.appendChild(li);
    (currentCategory === category) ? li.classList.add("active-category") : null;
    li.addEventListener("click", (event) => {
      const category = event.target.dataset.category;
      changeCategory(category);
    });
  }
}

export function showDatePicker() {
  const dueDateInput = document.querySelector('input#duedate');
  dueDateInput.showPicker();
}

function changeCategory(category) {
  const listInput = document.querySelector('input[type="hidden"][name="list"]');
  listInput.value = category;
  renderTasks(category);
  renderCategories();
}

function updateTaskStatus(e) {
  const taskNumber = e.target.parentElement.dataset.index;
  Task.updateStatus(taskNumber);
  const listInput = document.querySelector('input[type="hidden"][name="list"]');
  renderTasks(listInput.value);
}

function updateImportance(e) {
  const taskNumber = e.target.parentElement.dataset.index;
  Task.toggleImportance(taskNumber);
  const listInput = document.querySelector('input[type="hidden"][name="list"]');
  renderTasks(listInput.value);
}

function viewTaskDetails(taskElement) {
  const index = taskElement.dataset.index;
  const taskObj = Task.list[index];
  
  const taskDetailsContainer = document.createElement("dialog");

  const taskTitle = document.createElement('p');
  taskTitle.textContent = taskObj.title;
  taskDetailsContainer.appendChild(taskTitle);

  const deleteTaskButton = document.createElement('button');
  deleteTaskButton.textContent = "Remove Task";
  taskDetailsContainer.appendChild(deleteTaskButton);
  deleteTaskButton.addEventListener("click", () => {
    Task.remove(index);
    taskDetailsContainer.remove();
    const listInput = document.querySelector('input[type="hidden"][name="list"]');
    renderTasks(listInput.value);
    renderCategories();
  });

  document.querySelector('body').appendChild(taskDetailsContainer);
  taskDetailsContainer.showModal();
}