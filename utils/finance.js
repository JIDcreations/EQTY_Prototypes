export function simulateCompound({ contribution, years, returnRate }) {
  const months = years * 12;
  const monthlyRate = returnRate / 100 / 12;
  if (monthlyRate === 0) {
    const total = contribution * months;
    return { total, principal: total, growth: 0 };
  }
  const total = contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const principal = contribution * months;
  const growth = total - principal;
  return { total, principal, growth };
}

export function formatCurrency(value) {
  return `$${Math.round(value).toLocaleString()}`;
}
