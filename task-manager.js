import Task from "./task";
import {
  loadLists,
  loadNextId,
  loadTasks,
  saveLists,
  saveNextId,
  saveTasks,
} from "./storage";

const taskManager = {
  tasks: loadTasks(),
  lists: loadLists(),
  nextId: loadNextId(),

  addTask(title = "", dueDate = "", list = "Tasks") {
    const task = new Task({ id: this.nextId++, title, dueDate, list });
    this.tasks.push(task);
    saveTasks(this.tasks);
    saveNextId(this.nextId);
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    saveTasks(this.tasks);
  },

  editTask(id, fieldToEdit, newValue) {
    const task = this.tasks.find((task) => task.id === id);

    if (task) {
      let saveNeeded = true;

      switch (fieldToEdit) {
        case "title":
          task.editTitle(newValue);
          break;
        case "description":
          task.editDescription(newValue);
          break;
        case "dueDate":
          task.editDueDate(newValue);
          break;
        case "importance":
          task.toggleImportance();
          break;
        case "completion":
          task.toggleCompletion();
          break;
        default:
          saveNeeded = false;
      }

      if (saveNeeded) {
        saveTasks(this.tasks);
      }
    }
  },

  addList(listName) {
    if (!this.lists.includes(listName)) {
      this.lists.push(listName);
      saveLists(this.lists);
    }
  },

  deleteList(listName) {
    if (listName !== "Tasks") {
      this.lists = this.lists.filter((list) => list !== listName);
      saveLists(this.lists);
    }
  },

  renameList(listName, newName) {
    if (listName !== "Tasks") {
      if (this.lists.includes(listName)) {
        const index = this.lists.indexOf(listName);
        this.lists[index] = newName;
        saveLists(this.lists);
      }
    }
  },
};

export default taskManager;
