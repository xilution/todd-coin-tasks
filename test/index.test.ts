import { handler } from "../src";
import Chance from "chance";

const chance = new Chance();

describe("Index Tests", () => {
  describe("when saying hello", () => {
    let operation: string;

    beforeEach(function () {
      operation = chance.string();
      delete process.env.OPERATION;
      process.env.OPERATION = operation;

      jest.spyOn(console, "log").mockImplementation(() => {});

      handler();
    });

    it("should call console.log", function () {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toBeCalledWith(`Operation: ${operation}`);
    });
  });
});
