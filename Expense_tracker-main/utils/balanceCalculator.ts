
import { Expense, Balance, User } from '../types';

export const calculateGroupBalances = (expenses: Expense[], members: string[]): Balance[] => {
  const netBalances: Record<string, number> = {};
  members.forEach(m => netBalances[m] = 0);

  expenses.forEach(expense => {
    // Payer is owed the total minus their own share
    const payerShare = expense.splits.find(s => s.userId === expense.payerId)?.amount || 0;
    netBalances[expense.payerId] += (expense.amount - payerShare);

    // Others owe the payer
    expense.splits.forEach(split => {
      if (split.userId !== expense.payerId) {
        netBalances[split.userId] -= split.amount;
      }
    });
  });

  // Simplify balances (Greedy algorithm)
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(netBalances).forEach(([userId, balance]) => {
    if (balance < -0.01) debtors.push({ id: userId, amount: Math.abs(balance) });
    else if (balance > 0.01) creditors.push({ id: userId, amount: balance });
  });

  const balances: Balance[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settlement = Math.min(debtor.amount, creditor.amount);

    balances.push({
      fromUserId: debtor.id,
      toUserId: creditor.id,
      amount: settlement
    });

    debtor.amount -= settlement;
    creditor.amount -= settlement;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return balances;
};
