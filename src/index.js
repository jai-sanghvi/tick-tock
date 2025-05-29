import "./styles.css";
import {
  createNewListInput,
  handleDeleteList,
  handleRenameList,
  handleTaskInput,
  renderLists,
  renderTasks,
  showDatePicker,
} from "./modules/dom-manager";
import "@jai-sanghvi/dropdown";

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  renderLists();
});

const newListButton = document.querySelector("#new-list-button");
newListButton.addEventListener("click", createNewListInput);

const renameListButton = document.querySelector("#rename-list-button");
renameListButton.addEventListener("click", handleRenameList);

const deleteListButton = document.querySelector("#delete-list-button");
deleteListButton.addEventListener("click", handleDeleteList);

const taskInput = document.querySelector("#task-input");
taskInput.addEventListener("submit", handleTaskInput);

const datePickerButton = document.querySelector("#date-picker-button");
datePickerButton.addEventListener("click", showDatePicker);
