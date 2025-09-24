const {
  calculateCurrentMonthlyFee,
} = require("../../src/domain/debtOperaction");

// Mock de calculateMonthlyFee
jest.mock("../../src/domain/paymentPlanResult", () => ({
  calculateMonthlyFee: jest.fn((amount, rate, term) => {
    // simulated value
    return (amount * rate) / term;
  }),
}));

describe("calculateCurrentMonthlyFee", () => {
  it("should calculate total monthly debt from multiple loans", () => {
    const loans = [
      { amount: 1000000, rate: 20, term: 12 },
      { amount: 2000000, rate: 15, term: 24 },
    ];

    const result = calculateCurrentMonthlyFee(loans);

    expect(result).toBeCloseTo(16666.67 + 12500, 2);
  });
});
