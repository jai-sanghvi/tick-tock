export default class Task {
  constructor({
    id,
    title = "",
    description = "",
    dueDate = "",
    isComplete = false,
    isImportant = false,
    checklist = [],
    list = "Tasks",
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.isComplete = isComplete;
    this.isImportant = isImportant;
    this.checklist = checklist;
    this.list = list.trim() === "" ? "Tasks" : list;
  }

  update({
    title = "",
    dueDate = "",
    description = "",
    isComplete = false,
    isImportant = false,
    checklist = [],
    list = "Tasks",
  }) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.isComplete = isComplete;
    this.isImportant = isImportant;
    this.checklist = checklist;
    this.list = list.trim() === "" ? "Tasks" : list;
  }

  editTitle(newTitle = "") {
    this.title = newTitle;
  }

  editDescription(newDescription = "") {
    this.description = newDescription;
  }

  editList(newList = "Tasks") {
    this.list = newList.trim() === "" ? "Tasks" : newList;
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
