const TASKS_KEY = "tasks";
const LISTS_KEY = "lists";
const NEXT_ID_KEY = "nextId";

export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

export function loadLists() {
  try {
    return JSON.parse(localStorage.getItem(LISTS_KEY)) || ["Tasks"];
  } catch (e) {
    console.error("Failed to load lists", e);
    return ["Tasks"];
  }
}

export function loadNextId() {
  try {
    return JSON.parse(localStorage.getItem(NEXT_ID_KEY)) || 1;
  } catch (e) {
    console.error("Failed to load next id", e);
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function saveNextId(id) {
  localStorage.setItem(NEXT_ID_KEY, JSON.stringify(id));
}

export function saveLists(lists) {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}
