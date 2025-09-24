const { calculateMonthlyFee, generatePaymentPlan } = require("../../src/domain/paymentPlanResult");

describe("Payment Plan Calculations", () => {
  test("should calculate correct monthly fee with interest", () => {
    const amount = 50000;
    const rate = 20;  // anual rate
    const term = 2;   // termsMonths

    const monthlyFee = calculateMonthlyFee(amount, rate, term);

    // validate positive num
    expect(monthlyFee).toBeGreaterThan(0);

    // validate close to values expected)
    expect(monthlyFee).toBeCloseTo(25626.72, 2);
  });

  test("should calculate correct monthly fee with zero interest", () => {
    const amount = 10000;
    const rate = 0; // anualrate
    const term = 5; // monthts

    const monthlyFee = calculateMonthlyFee(amount, rate, term);

    expect(monthlyFee).toBe(2000); // payment
  });

  test("should generate a payment plan with correct length", () => {
    const amount = 50000;
    const rate = 20;
    const term = 2;

    const plan = generatePaymentPlan(amount, rate, term);

    // expect quaotas as terms
    expect(plan.length).toBe(2);

    // validade ich qouta has properties
    plan.forEach((p) => {
      expect(p).toHaveProperty("month");
      expect(p).toHaveProperty("monthlyFee");
      expect(p).toHaveProperty("rate");
      expect(p).toHaveProperty("principalPayment");
      expect(p).toHaveProperty("remininBalance");
    });
  });

  test("last payment should leave balance near zero", () => {
    const amount = 50000;
    const rate = 20;
    const term = 2;

    const plan = generatePaymentPlan(amount, rate, term);

    const lastPayment = plan[plan.length - 1];

    expect(lastPayment.remininBalance).toBeCloseTo(0, 2);
  });
});
