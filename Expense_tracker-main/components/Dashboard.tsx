
// import React, { useMemo, useState, useEffect } from 'react';
// import { Expense, Group, User, SplitType } from '../types';
// import { calculateGroupBalances } from '../utils/balanceCalculator';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { getSmartSummary } from '../services/geminiService';

// interface DashboardProps {
//   expenses: Expense[];
//   groups: Group[];
//   users: User[];
//   currentUser: User;
// }

// const Dashboard: React.FC<DashboardProps> = ({ expenses, groups, users, currentUser }) => {
//   const [aiSummary, setAiSummary] = useState("Generating smart summary...");

//   const totals = useMemo(() => {
//     let youOwe = 0;
//     let youAreOwed = 0;

//     groups.forEach(group => {
//       const groupExpenses = expenses.filter(e => e.groupId === group.id);
//       const balances = calculateGroupBalances(groupExpenses, group.members);
      
//       balances.forEach(b => {
//         if (b.fromUserId === currentUser.id) youOwe += b.amount;
//         if (b.toUserId === currentUser.id) youAreOwed += b.amount;
//       });
//     });

//     return { youOwe, youAreOwed, net: youAreOwed - youOwe };
//   }, [expenses, groups, currentUser]);

//   const categoryData = useMemo(() => {
//     const counts: Record<string, number> = {};
//     expenses.forEach(e => {
//       const cat = e.category || 'Other';
//       counts[cat] = (counts[cat] || 0) + e.amount;
//     });
//     return Object.entries(counts).map(([name, value]) => ({ name, value }));
//   }, [expenses]);

//   useEffect(() => {
//     if (expenses.length > 0) {
//       getSmartSummary(expenses.slice(-5)).then(setAiSummary);
//     } else {
//       setAiSummary("No recent expenses to analyze.");
//     }
//   }, [expenses]);

//   const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

//   return (
//     <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
//       <header className="mb-8">
//         <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
//         <p className="text-slate-500">Welcome back, {currentUser.name.split(' ')[0]}. Here's your overview.</p>
//       </header>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//           <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Balance</p>
//           <p className={`text-3xl font-bold ${totals.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
//             {totals.net >= 0 ? '+' : ''}${totals.net.toFixed(2)}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//           <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">You Owe</p>
//           <p className="text-3xl font-bold text-rose-500">${totals.youOwe.toFixed(2)}</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//           <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">You Are Owed</p>
//           <p className="text-3xl font-bold text-emerald-500">${totals.youAreOwed.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* AI Insights Bar */}
//       <div className="bg-indigo-600 text-white p-5 rounded-2xl mb-8 flex items-center gap-4 shadow-lg shadow-indigo-100">
//         <div className="bg-indigo-500 p-2 rounded-lg">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
//         </div>
//         <div>
//           <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-100">SplitSmart AI Insight</h3>
//           <p className="text-lg font-medium italic opacity-95">"{aiSummary}"</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Spending Chart */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//           <h3 className="text-lg font-bold text-slate-800 mb-6">Spending by Category</h3>
//           <div className="h-64">
//             {categoryData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={categoryData}>
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
//                   <YAxis axisLine={false} tickLine={false} />
//                   <Tooltip 
//                     cursor={{fill: '#f8fafc'}}
//                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
//                   />
//                   <Bar dataKey="value" radius={[6, 6, 0, 0]}>
//                     {categoryData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex items-center justify-center text-slate-400 italic">
//                 No expense data available to visualize.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
//           <div className="space-y-4">
//             {expenses.length > 0 ? (
//               expenses.slice(-5).reverse().map((expense) => {
//                 const group = groups.find(g => g.id === expense.groupId);
//                 const payer = users.find(u => u.id === expense.payerId);
//                 return (
//                   <div key={expense.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
//                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase text-xs">
//                       {expense.category?.[0] || 'E'}
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-slate-800">{expense.description}</p>
//                       <p className="text-xs text-slate-500">{payer?.name} paid in {group?.name}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-bold text-slate-800">${expense.amount.toFixed(2)}</p>
//                       <p className="text-[10px] text-slate-400">{new Date(expense.date).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-center py-8 text-slate-400 italic">No activity yet.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useMemo, useState, useEffect } from 'react';
import { Expense, Group, User } from '../types';
import { calculateGroupBalances } from '../utils/balanceCalculator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getSmartSummary } from '../services/geminiService';

interface DashboardProps {
  expenses: Expense[];
  groups: Group[];
  users: User[];
  currentUser: User;
}

/* ===========================
   SMART CATEGORY NORMALIZER
=========================== */
const normalizeCategory = (category?: string): string | null => {
  if (!category) return 'Other';

  const c = category.toLowerCase().trim();

  if (c.includes('food') || c.includes('drink') || c.includes('dining') || c.includes('grocery'))
    return 'Food';

  if (c.includes('travel') || c.includes('trip') || c.includes('flight') || c.includes('hotel'))
    return 'Travel';

  if (c.includes('transport') || c.includes('uber') || c.includes('ola') || c.includes('cab'))
    return 'Transport';

  if (c.includes('utility') || c.includes('electric') || c.includes('water') || c.includes('gas'))
    return 'Utilities';

  if (c.includes('entertain') || c.includes('movie') || c.includes('fun'))
    return 'Entertainment';

  if (c.includes('health') || c.includes('medical') || c.includes('gym'))
    return 'Health';

  if (c.includes('shop') || c.includes('purchase'))
    return 'Shopping';

  // ❌ Settlement is NOT spending
  if (c.includes('settlement'))
    return null;

  return 'Other';
};

const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  groups,
  users,
  currentUser
}) => {
  const [aiSummary, setAiSummary] = useState('Generating smart summary...');

  /* ===========================
     TOTAL BALANCES (OWE / OWED)
  =========================== */
  const totals = useMemo(() => {
    let youOwe = 0;
    let youAreOwed = 0;

    groups.forEach(group => {
      const groupExpenses = expenses.filter(e => e.groupId === group.id);
      const balances = calculateGroupBalances(groupExpenses, group.members);

      balances.forEach(b => {
        if (b.fromUserId === currentUser.id) youOwe += b.amount;
        if (b.toUserId === currentUser.id) youAreOwed += b.amount;
      });
    });

    return {
      youOwe,
      youAreOwed,
      net: youAreOwed - youOwe
    };
  }, [expenses, groups, currentUser.id]);

  /* ===========================
     ✅ FIXED SPENDING BY CATEGORY
     (USES USER SPLITS)
  =========================== */
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach(expense => {
      // ❌ Ignore settlements
      if (expense.category?.toLowerCase().includes('settlement')) return;

      // ✅ Only count CURRENT USER share
      const mySplit = expense.splits?.find(
        s => s.userId === currentUser.id
      );

      if (!mySplit || mySplit.amount <= 0) return;

      const category = normalizeCategory(expense.category);
      if (!category) return;

      totals[category] = (totals[category] || 0) + mySplit.amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value
    }));
  }, [expenses, currentUser.id]);

  /* ===========================
     AI SUMMARY
  =========================== */
  useEffect(() => {
    if (expenses.length > 0) {
      getSmartSummary(expenses.slice(-5)).then(setAiSummary);
    } else {
      setAiSummary('No recent expenses to analyze.');
    }
  }, [expenses]);

  const COLORS = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#f59e0b',
    '#10b981'
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">
          Welcome back, {currentUser.name.split(' ')[0]}. Here's your overview.
        </p>
      </header>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-slate-500 text-sm uppercase">Total Balance</p>
          <p
            className={`text-3xl font-bold ${
              totals.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {totals.net >= 0 ? '+' : ''}
            ${totals.net.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-slate-500 text-sm uppercase">You Owe</p>
          <p className="text-3xl font-bold text-rose-500">
            ${totals.youOwe.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-slate-500 text-sm uppercase">You Are Owed</p>
          <p className="text-3xl font-bold text-emerald-500">
            ${totals.youAreOwed.toFixed(2)}
          </p>
        </div>
      </div>

      {/* AI INSIGHT */}
      <div className="bg-indigo-600 text-white p-5 rounded-2xl mb-8">
        <p className="font-medium italic">"{aiSummary}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SPENDING BY CATEGORY */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="text-lg font-bold mb-6">Spending by Category</h3>

          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                No expense data available.
              </div>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>

          <div className="space-y-4">
            {expenses.slice(-5).reverse().map(expense => {
              const payer = users.find(u => u.id === expense.payerId);
              const group = groups.find(g => g.id === expense.groupId);

              return (
                <div
                  key={expense.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{expense.description}</p>
                    <p className="text-xs text-slate-500">
                      {payer?.name} in {group?.name}
                    </p>
                  </div>
                  <p className="font-bold">
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
