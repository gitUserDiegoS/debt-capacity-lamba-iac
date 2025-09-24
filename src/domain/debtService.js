const { calculateMonthlyFee } = require("./quotaService");
//calculate the cuurent deb of loans
function calculateCurrentMonthlyFee(loans) {
  return loans
    .map(p =>{
    
      const amount = Number(p.amount) || 0;
      const rate = Number(p.rate)/100 || 0;
      const term = Number(p.term) || 0;

      return calculateMonthlyFee(amount, rate, term);
      
      })
    .reduce((a, b) => a + b, 0);
}

module.exports = { calculateCurrentMonthlyFee };