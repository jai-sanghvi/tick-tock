import { handleTaskInput } from "./modules/dom";

const taskInput = document.querySelector("#task-input");
taskInput.addEventListener("submit", handleTaskInput);