const { calculateMaxCapacity, calculateAvailableCapacity } = require("../../src/domain/capacityOperation");
describe("capacityOperation", () => {
  describe("calculateMaxCapacity", () => {
    it("should return 35% of salary base", () => {
      const salaryBase = 5000000;
      const expected = 1750000; 
      expect(calculateMaxCapacity(salaryBase)).toBe(expected);
    });

  });

  describe("calculateAvailableCapacity", () => {
    it("should return difference between maxCapacity and actualDebt", () => {
      const maxCapacity = 1000;
      const actualDebt = 400;
      const expected = 600;
      expect(calculateAvailableCapacity(maxCapacity, actualDebt)).toBe(expected);
    });

  });
});
