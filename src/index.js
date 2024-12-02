import './styles.css'
import { handleTaskInput, renderTasks } from "./modules/dom";

const taskInput = document.querySelector("#task-input");
taskInput.addEventListener("submit", handleTaskInput);

document.addEventListener('DOMContentLoaded', renderTasks);