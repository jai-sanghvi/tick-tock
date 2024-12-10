export default class Task {
  constructor({ title, duedate, list = "default", isComplete = false, isImportant = false }) {
    this.title = title;
    this.list = list;
    this.isComplete = isComplete;
    this.isImportant = isImportant;
    this.dueDate = duedate;
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
    return JSON.parse(localStorage.getItem("tasks")) || [{"title":"task 1","list":"default","isComplete":false,"isImportant":false,"dueDate":"2024-12-05"},{"title":"task 2","list":"default","isComplete":false,"isImportant":false,"dueDate":"2024-12-10"},{"title":"task 3","list":"default","isComplete":false,"isImportant":false,"dueDate":"2024-12-11"},{"title":"task 4","list":"default","isComplete":false,"isImportant":false,"dueDate":"2024-12-25"},{"title":"task 5","list":"default","isComplete":false,"isImportant":false,"dueDate":"2025-01-08"},{"title":"task 6","list":"default","isComplete":true,"isImportant":false,"dueDate":"2024-12-03"}];
  }

  static set list(tasksJSON) {
    const tasksString = JSON.stringify(tasksJSON);
    localStorage.setItem("tasks", tasksString);
  }
  
  static get categories() {
    return JSON.parse(localStorage.getItem("categories")) || ['default'];
  }

  static set categories(categoriesJSON) {
    const categoriesString = JSON.stringify(categoriesJSON);
    localStorage.setItem("categories", categoriesString);
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

  static toggleImportance(taskNumber) {
    const tasksList = Task.list;
    if (tasksList[taskNumber].isImportant) {
      tasksList[taskNumber].isImportant = false;
    } else {
      tasksList[taskNumber].isImportant = true;
    }

    Task.list = tasksList;
  }

  static addNewCategory(name) {
    const categoriesList = Task.categories;
    if (categoriesList.includes(name)) {
      alert("List already exists!");
    } else {
      categoriesList.push(name);
      Task.categories = categoriesList;
    }
  }

  static remove(taskNumber) {
    const tasksList = Task.list;
    tasksList.splice(taskNumber, 1);
    Task.list = tasksList;
  }
}