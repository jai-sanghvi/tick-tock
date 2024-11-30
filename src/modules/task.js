export default class Task {
  constructor({ title, list = "default", isComplete = false }) {
    this.title = title;
    this.list = list;
    this.isComplete = isComplete;
  }

  static create(taskDetails) {
    const task = new Task(taskDetails);
    return task;
  }

  static save(task) {
    const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
    tasksList.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  }
}