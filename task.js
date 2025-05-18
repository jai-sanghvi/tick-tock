export default class Task {
  constructor({ id, title = "", dueDate = "", list = "Tasks" } = {}) {
    this.id = id;
    this.title = title;
    this.description = "";
    this.dueDate = dueDate;
    this.isComplete = false;
    this.isImportant = false;
    this.checklist = [];
    this.list = list.trim() === "" ? "Tasks" : list;
  }

  update({
    title = "",
    dueDate = "",
    description = "",
    isComplete = false,
    isImportant = false,
    checklist = [],
  }) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.isComplete = isComplete;
    this.isImportant = isImportant;
    this.checklist = checklist;
  }

  editTitle(newTitle = "") {
    this.title = newTitle;
  }

  editDescription(newDescription = "") {
    this.description = newDescription;
  }

  editDueDate(newDueDate = "") {
    this.dueDate = newDueDate;
  }

  toggleImportance() {
    this.isImportant = !this.isImportant;
  }

  toggleCompletion() {
    this.isComplete = !this.isComplete;
  }
}
