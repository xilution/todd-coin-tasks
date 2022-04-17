import { sayHello } from "../src";

describe("Index Tests", () => {
  describe("when saying hello", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let actual: any;
    beforeEach(function () {
      jest.spyOn(console, "log").mockImplementation(() => {});

      actual = sayHello();
    });

    it("should return undefined", function () {
      expect(actual).toBeUndefined();
    });

    it("should call console.log", function () {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toBeCalledWith("Hello");
    });
  });
});
