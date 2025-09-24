const {
  processAutomaticValidation,
} = require("../../src/application/automaticValidation");

//Mock dependencies
jest.mock("../../src/utils/logger", () => ({ info: jest.fn() }));
jest.mock("../../src/domain/capacityOperation", () => ({
  calculateMaxCapacity: jest.fn(),
  calculateAvailableCapacity: jest.fn(),
}));
jest.mock("../../src/domain/debtOperaction", () => ({
  calculateCurrentMonthlyFee: jest.fn(),
}));
jest.mock("../../src/domain/paymentPlanResult", () => ({
  calculateMonthlyFee: jest.fn(),
  generatePaymentPlan: jest.fn(),
}));
jest.mock("../../src/domain/decitionResult", () => ({
  takeDecisition: jest.fn(),
}));
jest.mock("../../src/adapters/sqsReponseAdapter", () => ({
  publishResponse: jest.fn(),
}));

const {
  calculateMaxCapacity,
  calculateAvailableCapacity,
} = require("../../src/domain/capacityOperation");
const {
  calculateCurrentMonthlyFee,
} = require("../../src/domain/debtOperaction");
const {
  calculateMonthlyFee,
  generatePaymentPlan,
} = require("../../src/domain/paymentPlanResult");
const { takeDecisition } = require("../../src/domain/decitionResult");
const { publishResponse } = require("../../src/adapters/sqsReponseAdapter");

describe("processAutomaticValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should orchestrate the validation flow and publish the response", async () => {
    const input = {
      salaryBase: 5000000,
      amount: 2000000,
      rate: 20,
      term: 12,
      loans: [{ amount: 1000000, rate: 15, term: 24, status: "APPROVED" }],
    };

    calculateMaxCapacity.mockReturnValue(1750000);
    calculateCurrentMonthlyFee.mockReturnValue(200000);
    calculateAvailableCapacity.mockReturnValue(1550000);
    calculateMonthlyFee.mockReturnValue(166000);
    takeDecisition.mockReturnValue("APPROVED");
    generatePaymentPlan.mockReturnValue([
      {
        month: 1,
        monthlyFee: 166000,
        rate: 10000,
        principalPayment: 156000,
        remininBalance: 1840000,
      },
    ]);

    // Act
    await processAutomaticValidation(input);

    // Assert
    expect(calculateMaxCapacity).toHaveBeenCalledWith(input.salaryBase);
    expect(calculateCurrentMonthlyFee).toHaveBeenCalledWith(input.loans);
    expect(calculateAvailableCapacity).toHaveBeenCalledWith(1750000, 200000);
    expect(calculateMonthlyFee).toHaveBeenCalledWith(
      input.amount,
      input.rate,
      input.term
    );
    expect(takeDecisition).toHaveBeenCalledWith(
      166000,
      1550000,
      2000000,
      5000000
    );
    expect(generatePaymentPlan).toHaveBeenCalledWith(
      input.amount,
      input.rate,
      input.term
    );

    expect(publishResponse).toHaveBeenCalledWith({
      decition: "APPROVED",
      maxCapacity: "1750000.00",
      currentDebt: "200000.00",
      availableCapacity: "1550000.00",
      newLoanPayment: "166000.00",
      paymentPlan: [
        {
          month: 1,
          monthlyFee: "166000.00",
          rate: "10000.00",
          principalPayment: "156000.00",
          remininBalance: "1840000.00",
        },
      ],
    });
  });
});
