export default class Task {
  constructor({ id, title = "", dueDate = "", list = "Tasks" } = {}) {
    this.id = id;
    this.title = title;
    this.description = "";
    this.dueDate = dueDate;
    this.isImportant = false;
    this.checklist = [];
    this.list = list.trim() === "" ? "Tasks" : list;
  }

  update({
    title = "",
    dueDate = "",
    description = "",
    isImportant = false,
    checklist = [],
  }) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.isImportant = isImportant;
    this.checklist = checklist;

    return this;
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
}
