import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Task } from "../src/task";
import { setTimeout } from "node:timers/promises";
import { mapPerson } from "../src/person";

describe("Person Test Suite", () => {
  describe("happy path", () => {
    it("happy path", () => {
      const personStr = '{"name": "Marcelo Wis", "age": 27}';
      const personObj = mapPerson(personStr);
      expect(personObj).toEqual({
        name: "Marcelo Wis",
        age: 27,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("what coverage doesnt tell you", () => {
    it("should not map person given invalid JSON String", () => {
      const personStr = '{"name": "Marcelo Wis}';

      expect(() => mapPerson(personStr)).toThrow(
        "Unexpected end of JSON input"
      );
    });
    it("should not map person given invalid JSON String", () => {
      const personStr = "{}";

      const personObj = mapPerson(personStr);
      expect(personObj).toEqual({
        name: undefined,
        age: undefined,
        createdAt: expect.any(Date),
      });
    });
  });
});
