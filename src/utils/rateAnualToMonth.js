/**
 * convert the annualRate in percentage to monthly decimal rate
 * Example: 20.00 → 0.20 / 12 = 0.0167
 */
function toMonthlyRate(annualRatePercent) {
  return annualRatePercent / 100 / 12;
}

module.exports = { toMonthlyRate };
