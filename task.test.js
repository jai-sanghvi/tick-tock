import { describe, expect, it } from "@jest/globals";
import Task from "./task";

describe("Task", () => {
  describe("Creation", () => {
    it("creates a new task for given inputs", () => {
      const task1 = {
        inputs: {
          id: 1,
          title: "do math homework",
          dueDate: "2025-05-02",
          list: "School",
        },
        expectation: {
          id: 1,
          title: "do math homework",
          description: "",
          dueDate: "2025-05-02",
          isImportant: false,
          checklist: [],
          list: "School",
        },
      };

      const task2 = {
        inputs: {
          id: 1,
          title: "study history",
          dueDate: "2025-10-19",
          list: "School",
        },
        expectation: {
          id: 1,
          title: "study history",
          description: "",
          dueDate: "2025-10-19",
          isImportant: false,
          checklist: [],
          list: "School",
        },
      };

      expect(new Task(task1.inputs)).toEqual(task1.expectation);
      expect(new Task(task2.inputs)).toEqual(task2.expectation);
    });

    it("creates an empty task for no inputs", () => {
      const emptyTask = {
        inputs: {
          id: 1,
          title: "",
          dueDate: "",
          list: "",
        },
        expectation: {
          id: 1,
          title: "",
          description: "",
          dueDate: "",
          isImportant: false,
          checklist: [],
          list: "Tasks",
        },
      };

      expect(new Task(emptyTask.inputs)).toEqual(emptyTask.expectation);
    });
  });

  describe("Updation", () => {
    it("updates task details as per inputs", () => {
      const task = {
        inputs: {
          id: 1,
          title: "test task title",
          dueDate: "2025-11-30",
          list: "Tasks",
        },
        modifications: {
          title: "modified test task title",
          dueDate: "2025-11-15",
          description: "test task description added after modification",
          isImportant: true,
          checklist: [],
        },
        expectation: {
          id: 1,
          title: "modified test task title",
          dueDate: "2025-11-15",
          list: "Tasks",
          description: "test task description added after modification",
          isImportant: true,
          checklist: [],
        },
      };

      const myTask = new Task(task.inputs);

      expect(myTask.update(task.modifications)).toEqual(task.expectation);
    });

    it("edits task title", () => {
      const task = new Task({
        id: 1,
        title: "test task",
        dueDate: "2025-10-20",
      });

      task.editTitle("new title");
      expect(task.title).toBe("new title");

      task.editTitle("another new title");
      expect(task.title).toBe("another new title");
    });

    it("edits task description", () => {
      const task = new Task({
        id: 1,
        title: "test task",
        dueDate: "2025-10-20",
      });

      task.editDescription("new description");
      expect(task.description).toBe("new description");

      task.editDescription("another new description");
      expect(task.description).toBe("another new description");
    });

    it("edits task due date", () => {
      const task = new Task({
        id: 1,
        title: "test task",
        dueDate: "2025-10-20",
      });

      task.editDueDate("2025-06-04");
      expect(task.dueDate).toBe("2025-06-04");

      task.editDueDate("2025-08-15");
      expect(task.dueDate).toBe("2025-08-15");
    });

    it("toggles task importance", () => {
      const task = new Task({ id: 1, title: "test task" });

      expect(task.isImportant).toBe(false);

      task.toggleImportance();
      expect(task.isImportant).toBe(true);

      task.toggleImportance();
      expect(task.isImportant).toBe(false);
    });
  });
});
