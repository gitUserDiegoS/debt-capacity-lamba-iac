const { takeDecisition } = require("../../src/domain/decitionResult");

describe("takeDecisition", () => {
  it("should return REJECTED if new loan payment > available capacity", () => {
    const result = takeDecisition(2000, 1000, 50000, 10000);
    expect(result).toBe("REJECTED");
  });

  it("should return MANUAL REVIEW if amount > 5 * salaryBase", () => {
    const result = takeDecisition(1000, 5000, 60000, 10000);
    expect(result).toBe("MANUAL REVIEW");
  });

  it("should return APPROVED if conditions are satisfied", () => {
    const result = takeDecisition(1000, 5000, 20000, 10000);
    expect(result).toBe("APPROVED");
  });


});
