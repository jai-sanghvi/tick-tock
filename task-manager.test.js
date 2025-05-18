import { describe, expect, it, jest } from "@jest/globals";
import taskManager from "./task-manager";
import Task from "./task";
import { saveLists, saveTasks } from "./storage";

jest.mock("./storage", () => {
  const originalModule = jest.requireActual("./storage");

  return {
    __esModule: true,
    ...originalModule,
    loadTasks: jest.fn(() => []),
    loadLists: jest.fn(() => ["Tasks"]),
    loadNextId: jest.fn(() => 1),
    saveTasks: jest.fn(),
    saveNextId: jest.fn(),
    saveLists: jest.fn(),
  };
});

describe("Task Manager", () => {
  it("appends new task to the list and saves it to localStorage", () => {
    const task1 = new Task({
      id: 1,
      title: "test task title 1",
      dueDate: "2025-10-25",
      list: "Tasks",
    });

    const task2 = new Task({
      id: 2,
      title: "test task title 2",
      dueDate: "2025-11-12",
      list: "Tasks",
    });

    taskManager.addTask("test task title 1", "2025-10-25", "Tasks");
    expect(taskManager.tasks.at(-1)).toEqual(task1);
    expect(saveTasks).toHaveBeenCalledTimes(1);

    taskManager.addTask("test task title 2", "2025-11-12", "Tasks");
    expect(taskManager.tasks.at(-1)).toEqual(task2);
    expect(saveTasks).toHaveBeenCalledTimes(2);
  });

  it("deletes task from list by an id and saves updated list to localStorage", () => {
    taskManager.addTask("test task title 3", "2026-01-04", "Tasks");
    expect(taskManager.tasks.length).toBe(3);

    taskManager.deleteTask(1);
    expect(taskManager.tasks.length).toBe(2);
    expect(taskManager.tasks.find((task) => task.id === 1)).toBeUndefined();

    expect(saveTasks).toHaveBeenCalledTimes(4);
  });

  it("adds a new list and saves to localStorage", () => {
    taskManager.addList("Work");
    expect(taskManager.lists.includes("Work")).toBeTruthy();
    expect(taskManager.lists.length).toBe(2);
    expect(saveLists).toHaveBeenCalledTimes(1);
  });

  it("does not create a duplicate list", () => {
    taskManager.addList("Work");
    expect(taskManager.lists.length).toBe(2);
  });

  it("deletes an existing list and saves updated lists to localStorage", () => {
    taskManager.deleteList("Work");
    expect(taskManager.lists.length).toBe(1);
    expect(taskManager.lists.indexOf("Work")).toBe(-1);
    expect(saveLists).toHaveBeenCalledTimes(2);
  });

  it("does not delete the default list", () => {
    taskManager.deleteList("Tasks");
    expect(taskManager.lists.length).toBe(1);
    expect(taskManager.lists.indexOf("Tasks")).not.toBe(-1);
  });

  describe("editTask()", () => {
    it("can edit a task's title and save updated tasks", () => {
      const task = taskManager.tasks.find((task) => task.id === 3);
      taskManager.editTask(3, "title", "edited");
      expect(task.title).toBe("edited");
      expect(saveTasks).toHaveBeenCalledTimes(5);
    });

    it("can edit a task's description and save updated tasks", () => {
      const task = taskManager.tasks.find((task) => task.id === 3);
      taskManager.editTask(3, "description", "some random description");
      expect(task.description).toBe("some random description");
      expect(saveTasks).toHaveBeenCalledTimes(6);
    });

    it("can edit a task's dueDate and save updated tasks", () => {
      const task = taskManager.tasks.find((task) => task.id === 3);
      taskManager.editTask(3, "dueDate", "2025-04-24");
      expect(task.dueDate).toBe("2025-04-24");
      expect(saveTasks).toHaveBeenCalledTimes(7);
    });

    it("can toggle a task's importance and save updated tasks", () => {
      const task = taskManager.tasks.find((task) => task.id === 3);
      taskManager.editTask(3, "importance");
      expect(task.isImportant).toBe(true);
      expect(saveTasks).toHaveBeenCalledTimes(8);
    });
  });

  it("can rename a list and saves updated lists", () => {
    taskManager.addList("Work");

    taskManager.renameList("Work", "School");
    expect(taskManager.lists.includes("Work")).toBe(false);
    expect(saveLists).toHaveBeenCalledTimes(4);
  });

  it("does not rename the default list", () => {
    taskManager.renameList("Tasks", "something else");
    expect(taskManager.lists.includes("Tasks")).toBe(true);
    expect(taskManager.lists.includes("something else")).toBe(false);
  });
});
