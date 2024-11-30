import Task from "./task";

export function handleTaskInput(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  event.target.reset();
  const formDataObj = Object.fromEntries(formData);
  const task = Task.create(formDataObj);
  Task.save(task);
}