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

  static addToList(task) {
    const tasksList = Task.list;
    tasksList.push(task);
    Task.list = tasksList;
  }

  static get list() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  static set list(listJSON) {
    const listString = JSON.stringify(listJSON);
    localStorage.setItem("tasks", listString);
  }

  static updateStatus(taskNumber) {
    const tasksList = Task.list;
    if (tasksList[taskNumber].isComplete) {
      tasksList[taskNumber].isComplete = false;
    } else {
      tasksList[taskNumber].isComplete = true;
    }

    Task.list = tasksList;
  }
}