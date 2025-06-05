import taskManager from "./task-manager";
import checkOutline from "../assets/check-circle-outline.svg";
import circleOutline from "../assets/circle-outline.svg";
import checkFilled from "../assets/check-circle.svg";
import star from "../assets/star.svg";
import starOutline from "../assets/star-outline.svg";
import calendar from "../assets/calendar.svg";
import plusIcon from "../assets/plus.svg";
import trashIcon from "../assets/trash-bin.svg";
import { format } from "date-fns";

let currentList = "Tasks";
let isCurrentListDynamic = false;
const currentListTitleElement = document.querySelector("#current-list-title");
let currentTaskDetails = null;
const addTaskForm = document.querySelector("form#task-input");

export function renderTasks(list = "Tasks") {
  // clear old tasks data
  const tasksContainer = document.querySelector("#tasks-container");

  if (tasksContainer) {
    tasksContainer.remove();
  }

  // render updated tasks data
  appendUpdatedTasks(list);
}

function appendUpdatedTasks(list) {
  let tasksOfCurrentList;

  // identify tasks of current list
  if (isCurrentListDynamic) {
    switch (list) {
      case "Today":
        tasksOfCurrentList = taskManager.tasks.filter((task) => {
          const currentDate = new Date();
          const dueDate = new Date(task.dueDate);

          [currentDate, dueDate].forEach((date) => date.setHours(0, 0, 0, 0));

          const timeDiff = dueDate - currentDate;

          return timeDiff === 0;
        });
        break;
      case "Important":
        tasksOfCurrentList = taskManager.tasks.filter(
          (task) => task.isImportant === true,
        );
        break;
    }
  } else {
    tasksOfCurrentList = taskManager.tasks.filter((task) => task.list === list);
  }

  const tasksContainer = document.createElement("div");
  tasksContainer.id = "tasks-container";

  const incompleteTasksContainer = document.createElement("ul");
  incompleteTasksContainer.id = "incomplete-tasks";

  const detailsElement = document.createElement("details");
  detailsElement.setAttribute("open", "");

  const completeTasksTitle = document.createElement("summary");
  completeTasksTitle.textContent = "Completed Tasks";
  detailsElement.appendChild(completeTasksTitle);

  const completeTasksContainer = document.createElement("ul");
  completeTasksContainer.id = "complete-tasks";
  detailsElement.appendChild(completeTasksContainer);

  // Loop over tasks and list them as complete or incomplete respectively
  for (let task of tasksOfCurrentList) {
    // create task element
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");

    // create complete task button
    const completeButton = document.createElement("input");
    completeButton.classList.add("complete-button");
    completeButton.setAttribute("type", "image");
    completeButton.setAttribute("alt", "complete task toggle");
    completeButton.setAttribute(
      "src",
      task.isComplete ? checkFilled : circleOutline,
    );
    completeButton.setAttribute("width", "25");
    completeButton.setAttribute("height", "25");

    completeButton.addEventListener("mouseenter", () => {
      if (!task.isComplete) {
        completeButton.setAttribute("src", checkOutline);
      }
    });

    completeButton.addEventListener("mouseleave", () => {
      if (!task.isComplete) {
        completeButton.setAttribute("src", circleOutline);
      }
    });

    completeButton.addEventListener("click", () => {
      taskManager.editTask(task.id, "completion");
      renderTasks(currentList);

      if (currentTaskDetails === task) {
        document.querySelector("#task-details").remove();
        viewTaskDetails(currentTaskDetails);
      }
    });
    taskElement.appendChild(completeButton);

    // create task title
    const title = document.createElement("p");
    const titleText = document.createElement("span");
    titleText.textContent = task.title;
    if (task.isComplete) {
      titleText.classList.add("striked-out");
    }
    title.appendChild(titleText);
    taskElement.appendChild(title);

    // duedate
    if (task.dueDate) {
      const ONE_DAY = 86400000;
      const currentDate = new Date();
      const dueDate = new Date(task.dueDate);

      [currentDate, dueDate].forEach((date) => date.setHours(0, 0, 0, 0));

      const timeDiff = dueDate - currentDate;
      const isOverdue = timeDiff < 0 && !task.isComplete;

      const dueDateElement = document.createElement("span");
      dueDateElement.classList.add("duedate");

      const calendarIcon = document.createElement("img");
      calendarIcon.setAttribute("width", "15");
      calendarIcon.setAttribute("height", "15");
      calendarIcon.setAttribute("alt", "calendar icon");
      calendarIcon.setAttribute("src", calendar);
      dueDateElement.appendChild(calendarIcon);

      // Set label
      const dueDateLabel = document.createElement("span");
      if (timeDiff === 0) {
        dueDateLabel.textContent = "Today";
      } else if (timeDiff === ONE_DAY) {
        dueDateLabel.textContent = "Tomorrow";
      } else {
        const formatString =
          currentDate.getFullYear() === dueDate.getFullYear()
            ? "E, do MMM"
            : "E, do MMM, yyyy";
        dueDateLabel.textContent = format(dueDate, formatString);
      }
      dueDateElement.appendChild(dueDateLabel);

      if (isOverdue) {
        dueDateElement.classList.add("overdue");
      }

      title.appendChild(dueDateElement);
    }

    // create importance button
    const importanceButton = document.createElement("input");
    importanceButton.classList.add("importance-button");
    importanceButton.setAttribute("type", "image");
    importanceButton.setAttribute("src", task.isImportant ? star : starOutline);
    importanceButton.setAttribute(
      "title",
      task.isImportant ? "Remove importance" : "Mark as important",
    );
    importanceButton.setAttribute("width", "20");
    importanceButton.setAttribute("height", "20");
    importanceButton.addEventListener("click", () => {
      taskManager.editTask(task.id, "importance");
      renderTasks(currentList);
      renderLists();

      if (currentTaskDetails === task) {
        document.querySelector("#task-details").remove();
        viewTaskDetails(currentTaskDetails);
      }
    });
    taskElement.appendChild(importanceButton);

    // append task element
    if (task.isComplete) {
      completeTasksContainer.appendChild(taskElement);
    } else {
      incompleteTasksContainer.appendChild(taskElement);
    }

    taskElement.addEventListener("click", (e) => {
      if (e.target !== importanceButton && e.target !== completeButton) {
        if (currentTaskDetails === task) {
          document.querySelector("#task-details").remove();
          currentTaskDetails = null;
          document.querySelector("#tasks").style.width = "80%";
        } else if (!currentTaskDetails) {
          viewTaskDetails(task);
        } else {
          document.querySelector("#task-details").remove();
          currentTaskDetails = null;
          viewTaskDetails(task);
        }
      }
    });
  }

  tasksContainer.appendChild(incompleteTasksContainer);
  tasksContainer.appendChild(detailsElement);

  document.querySelector("#tasks").insertBefore(tasksContainer, addTaskForm);
}

export function renderLists() {
  // clear old lists data
  const listsContainer = document.querySelector("#lists-container");

  if (listsContainer) {
    listsContainer.remove();
  }

  // render updated lists data
  appendUpdatedLists();
}

function appendUpdatedLists() {
  const listsContainer = document.createElement("ul");
  listsContainer.id = "lists-container";

  const dynamicLists = ["Today", "Important"];
  const allLists = [...dynamicLists, ...taskManager.lists];

  const taskCounts = {};
  const dynamicTaskCounts = {};

  // populate taskCounts per list
  for (let task of taskManager.tasks) {
    taskCounts[task.list] = isNaN(taskCounts[task.list])
      ? 1
      : ++taskCounts[task.list];

    if (task.isImportant) {
      dynamicTaskCounts["Important"] = isNaN(dynamicTaskCounts["Important"])
        ? 1
        : ++dynamicTaskCounts["Important"];
    }

    if (task.dueDate) {
      const currentDate = new Date();
      const dueDate = new Date(task.dueDate);

      [currentDate, dueDate].forEach((date) => date.setHours(0, 0, 0, 0));

      const timeDiff = dueDate - currentDate;

      if (timeDiff === 0) {
        dynamicTaskCounts["Today"] = isNaN(dynamicTaskCounts["Today"])
          ? 1
          : ++dynamicTaskCounts["Today"];
      }
    }
  }

  for (let [index, list] of allLists.entries()) {
    const listElement = document.createElement("li");

    // create list name element
    const listName = document.createElement("span");
    listName.textContent = list;
    listElement.appendChild(listName);

    // add identifier to current list and dynamic lists
    if (index >= dynamicLists.length) {
      // create task count element
      if (taskCounts[list] > 0) {
        const taskCount = document.createElement("span");
        taskCount.classList.add("list-size-count");
        taskCount.textContent = taskCounts[list];
        listElement.appendChild(taskCount);
      }

      listElement.addEventListener("click", () => changeList(list));

      if (!isCurrentListDynamic && list === currentList) {
        listElement.classList.add("current-list");
      }
    } else {
      // create task count element
      if (dynamicTaskCounts[list] > 0) {
        const taskCount = document.createElement("span");
        taskCount.classList.add("list-size-count");
        taskCount.textContent = dynamicTaskCounts[list];
        listElement.appendChild(taskCount);
      }

      listElement.addEventListener("click", () => changeList(list, true));

      if (isCurrentListDynamic && list === currentList) {
        listElement.classList.add("current-list");
      }
    }

    listsContainer.appendChild(listElement);
  }

  const newListButton = document.querySelector("#new-list-button");
  document.querySelector("#lists").insertBefore(listsContainer, newListButton);
}

export function createNewListInput() {
  const listsContainer = document.querySelector("#lists-container");

  const li = document.createElement("li");
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.value = "Untitled";

  form.appendChild(input);
  li.appendChild(form);
  listsContainer.appendChild(li);
  li.classList.add("temp-input");

  input.focus();
  input.select();

  input.addEventListener("blur", addNewList);
  form.addEventListener("submit", addNewList);

  function addNewList(e) {
    if (e.type === "submit") {
      e.preventDefault();
    }

    input.removeEventListener("blur", addNewList);
    form.removeEventListener("submit", addNewList);

    if (input.value !== "") {
      taskManager.addList(input.value);
      changeList(input.value);
    } else {
      renderLists();
    }
  }
}

function changeList(list = "Tasks", dynamic = false) {
  if (currentList !== list || isCurrentListDynamic !== dynamic) {
    if (currentTaskDetails) {
      document.querySelector("#task-details").remove();
      currentTaskDetails = null;
      document.querySelector("#tasks").style.width = "80%";
    }
  }
  currentList = list;
  isCurrentListDynamic = dynamic;
  renderTasks(currentList);
  renderLists();
  renderListHeader();

  if (currentList === "Tasks" || dynamic === true) {
    document.querySelector("#list-settings-container").style.display = "none";
  } else {
    document.querySelector("#list-settings-container").style.display = "block";
  }

  if (dynamic) {
    addTaskForm.style.display = "none";
  } else {
    addTaskForm.style.display = "flex";
  }
}

function renderListHeader() {
  currentListTitleElement.textContent = currentList;
}

export function handleRenameList() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("autocomplete", "off");
  input.value = currentListTitleElement.textContent;

  form.appendChild(input);
  document
    .querySelector("#tasks header")
    .insertBefore(form, currentListTitleElement);
  currentListTitleElement.style.display = "none";

  input.classList.add("temp-list-title");

  input.focus();
  input.select();

  input.addEventListener("blur", updateListName);
  form.addEventListener("submit", updateListName);

  function updateListName(e) {
    if (e.type === "submit") {
      e.preventDefault();
    }

    input.removeEventListener("blur", updateListName);
    form.removeEventListener("submit", updateListName);

    if (
      input.value !== "" &&
      taskManager.renameList(currentList, input.value)
    ) {
      for (let task of taskManager.tasks) {
        if (task.list === currentList) {
          taskManager.editTask(task.id, "list", input.value);
        }
      }
      currentList = input.value;
      renderListHeader();
      renderLists();
    }

    currentListTitleElement.style.display = "block";
    form.remove();
  }
}

export function handleDeleteList() {
  const dialog = document.createElement("dialog");
  dialog.classList.add("delete-list-dialog");
  dialog.addEventListener("close", handleDialogClose);

  const p = document.createElement("p");
  p.textContent = `Delete list "${currentList}" and all of it's tasks?`;

  const buttonsContainer = document.createElement("div");

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", handleButtonClick);

  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("type", "button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", handleButtonClick);

  dialog.appendChild(p);
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(deleteButton);
  dialog.appendChild(buttonsContainer);
  document.body.appendChild(dialog);

  dialog.showModal();

  function handleButtonClick(e) {
    if (e.target === deleteButton) {
      taskManager.deleteList(currentList);

      for (let task of taskManager.tasks) {
        if (task.list === currentList) {
          taskManager.deleteTask(task.id);
        }
      }

      changeList("Tasks");
    }

    dialog.close();
  }

  function handleDialogClose() {
    dialog.remove();
  }
}

export function handleTaskInput(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  event.target.reset();
  const formDataObj = Object.fromEntries(formData);
  taskManager.addTask(formDataObj.title, formDataObj.duedate, currentList);
  renderTasks(currentList);
  renderLists();
}

export function showDatePicker() {
  const dueDateInput = document.querySelector("input#duedate");
  dueDateInput.showPicker();
}

function viewTaskDetails(task) {
  currentTaskDetails = task;

  // create container
  const taskDetailsContainer = document.createElement("aside");
  taskDetailsContainer.id = "task-details";

  document.querySelector("#tasks").style.width = "55%";

  const inputsContainer = document.createElement("div");
  inputsContainer.classList.add("inputs-container");

  // create close button
  const closeButtonContainer = document.createElement("div");
  closeButtonContainer.id = "close-button";
  closeButtonContainer.style.justifySelf = "end";
  closeButtonContainer.addEventListener("click", () => {
    taskDetailsContainer.remove();
    document.querySelector("#tasks").style.width = "80%";
    currentTaskDetails = null;
  });

  const closeButton = document.createElement("img");
  closeButton.setAttribute("src", plusIcon);
  closeButton.setAttribute("width", "20");
  closeButton.setAttribute("height", "20");
  closeButton.style.rotate = "45deg";

  closeButtonContainer.appendChild(closeButton);
  inputsContainer.appendChild(closeButtonContainer);

  // create task title input, importance and completion button

  const taskElement = document.createElement("div");
  taskElement.classList.add("task-edit");

  // create complete task button
  const completeButton = document.createElement("input");
  completeButton.classList.add("complete-button");
  completeButton.setAttribute("type", "image");
  completeButton.setAttribute("alt", "complete task toggle");
  completeButton.setAttribute(
    "src",
    task.isComplete ? checkFilled : circleOutline,
  );
  completeButton.setAttribute("width", "25");
  completeButton.setAttribute("height", "25");

  completeButton.addEventListener("mouseenter", () => {
    if (!task.isComplete) {
      completeButton.setAttribute("src", checkOutline);
    }
  });

  completeButton.addEventListener("mouseleave", () => {
    if (!task.isComplete) {
      completeButton.setAttribute("src", circleOutline);
    }
  });

  completeButton.addEventListener("click", () => {
    taskManager.editTask(task.id, "completion");
    renderTasks(currentList);
    taskDetailsContainer.remove();
    viewTaskDetails(task);
  });

  taskElement.appendChild(completeButton);

  // create task title
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.value = task.title;

  if (task.isComplete) {
    titleInput.classList.add("striked-out");
  }

  titleInput.addEventListener("blur", () => {
    if (titleInput.value !== "") {
      taskManager.editTask(task.id, "title", titleInput.value);
      renderTasks(currentList);
    } else {
      titleInput.value = task.title;
    }
  });

  taskElement.appendChild(titleInput);

  // create importance button
  const importanceButton = document.createElement("input");
  importanceButton.classList.add("importance-button");
  importanceButton.setAttribute("type", "image");
  importanceButton.setAttribute("src", task.isImportant ? star : starOutline);
  importanceButton.setAttribute(
    "title",
    task.isImportant ? "Remove importance" : "Mark as important",
  );
  importanceButton.setAttribute("width", "20");
  importanceButton.setAttribute("height", "20");
  importanceButton.addEventListener("click", () => {
    taskManager.editTask(task.id, "importance");
    renderTasks(currentList);
    renderLists();
    taskDetailsContainer.remove();
    viewTaskDetails(task);
  });
  taskElement.appendChild(importanceButton);

  inputsContainer.appendChild(taskElement);

  // create description input
  const descriptionInput = document.createElement("textarea");
  descriptionInput.classList.add("description-edit");
  descriptionInput.setAttribute("placeholder", "Add description");
  descriptionInput.setAttribute("rows", "3");
  descriptionInput.value = task.description;
  descriptionInput.addEventListener("blur", () => {
    taskManager.editTask(task.id, "description", descriptionInput.value);
  });

  inputsContainer.appendChild(descriptionInput);

  // create duedate input
  const dueDateButton = document.createElement("button");
  dueDateButton.setAttribute("type", "button");
  dueDateButton.classList.add("due-date-edit");

  const calendarIcon = document.createElement("img");
  calendarIcon.setAttribute("width", "20");
  calendarIcon.setAttribute("height", "20");
  calendarIcon.setAttribute("alt", "calendar icon");
  calendarIcon.setAttribute("src", calendar);
  dueDateButton.appendChild(calendarIcon);

  const dueDateText = document.createElement("span");

  if (task.dueDate) {
    const ONE_DAY = 86400000;
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);

    [currentDate, dueDate].forEach((date) => date.setHours(0, 0, 0, 0));

    const timeDiff = dueDate - currentDate;
    const isOverdue = timeDiff < 0 && !task.isComplete;

    if (timeDiff === 0) {
      dueDateText.textContent = "Due Today";
    } else if (timeDiff === ONE_DAY) {
      dueDateText.textContent = "Due Tomorrow";
    } else {
      const formatString =
        currentDate.getFullYear() === dueDate.getFullYear()
          ? "E, do MMM"
          : "E, do MMM, yyyy";
      dueDateText.textContent = `Due ${format(dueDate, formatString)}`;
    }

    if (isOverdue) {
      dueDateText.classList.add("overdue");
    }
  } else {
    dueDateText.textContent = "Add due date";
  }

  const dueDateInput = document.createElement("input");
  dueDateInput.setAttribute("type", "date");
  dueDateInput.addEventListener("input", () => {
    taskManager.editTask(task.id, "dueDate", dueDateInput.value);
    renderTasks(currentList);
    renderLists();
    taskDetailsContainer.remove();
    viewTaskDetails(task);
  });

  dueDateButton.addEventListener("click", () => {
    dueDateInput.showPicker();
  });

  dueDateButton.appendChild(dueDateInput);
  dueDateButton.appendChild(dueDateText);

  inputsContainer.appendChild(dueDateButton);

  taskDetailsContainer.appendChild(inputsContainer);

  // create delete task button
  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.setAttribute("type", "button");
  deleteTaskButton.classList.add("delete-task-button");
  deleteTaskButton.addEventListener("click", () => {
    handleDeleteTask(task);
  });

  const deleteIcon = document.createElement("img");
  deleteIcon.setAttribute("width", "20");
  deleteIcon.setAttribute("height", "20");
  deleteIcon.setAttribute("alt", "trash icon");
  deleteIcon.setAttribute("src", trashIcon);
  deleteTaskButton.appendChild(deleteIcon);

  const deleteTaskText = document.createElement("span");
  deleteTaskText.textContent = "Delete Task";
  deleteTaskButton.appendChild(deleteTaskText);

  taskDetailsContainer.appendChild(deleteTaskButton);

  document.querySelector("main").appendChild(taskDetailsContainer);
}

function handleDeleteTask(task) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("delete-task-dialog");
  dialog.addEventListener("close", handleDialogClose);

  const p = document.createElement("p");
  p.textContent = `"${task.title}" will be permanently deleted`;

  const buttonsContainer = document.createElement("div");

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", handleButtonClick);

  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("type", "button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", handleButtonClick);

  dialog.appendChild(p);
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(deleteButton);
  dialog.appendChild(buttonsContainer);
  document.body.appendChild(dialog);

  dialog.showModal();

  function handleButtonClick(e) {
    if (e.target === deleteButton) {
      taskManager.deleteTask(task.id);
      document.querySelector("#task-details").remove();
      document.querySelector("#tasks").style.width = "80%";
      currentTaskDetails = null;
      renderTasks(currentList);
      renderLists();
    }

    dialog.close();
  }

  function handleDialogClose() {
    dialog.remove();
  }
}
