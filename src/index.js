import './styles.css'
import { handleTaskInput, createCategoryInput, renderTasks, renderCategories } from "./modules/dom";

document.addEventListener('DOMContentLoaded', () => renderTasks());
document.addEventListener('DOMContentLoaded', renderCategories);

const taskInput = document.querySelector("#task-input");
taskInput.addEventListener("submit", handleTaskInput);

const newListButton = document.querySelector('#new-list');
newListButton.addEventListener("click", createCategoryInput);