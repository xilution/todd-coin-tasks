import { doSync } from "../dist/operations";

describe("Operations Tests", function () {
  describe("when doing sync operation", function () {
    let actualError: any;

    beforeEach(async () => {
      try {
        await doSync();
      } catch (error) {
        actualError = error;
      }
    });

    it("should throw a not implemented error", function () {
      expect(actualError).toEqual(new Error("not implemented yet"));
    });
  });
});
