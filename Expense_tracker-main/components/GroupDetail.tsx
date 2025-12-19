
// import React from 'react';
// import { Group, Expense, User, Balance } from '../types';
// import { calculateGroupBalances } from '../utils/balanceCalculator';

// interface GroupDetailProps {
//   group: Group;
//   expenses: Expense[];
//   users: User[];
//   currentUser: User;
//   onAddExpense: () => void;
// }

// const GroupDetail: React.FC<GroupDetailProps> = ({ group, expenses, users, currentUser, onAddExpense }) => {
//   const balances = calculateGroupBalances(expenses, group.members);

//   const getMember = (id: string) => users.find(u => u.id === id);

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-800">{group.name}</h2>
//           <div className="flex -space-x-2 mt-2">
//             {group.members.map(mid => {
//               const u = getMember(mid);
//               return u ? <img key={mid} src={u.avatar} title={u.name} className="w-8 h-8 rounded-full border-2 border-white" alt={u.name} /> : null;
//             })}
//           </div>
//         </div>
//         <button 
//           onClick={onAddExpense}
//           className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
//         >
//           Add Expense
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-2 space-y-4">
//           <h3 className="text-lg font-bold text-slate-800">Expenses</h3>
//           {expenses.length === 0 ? (
//             <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
//               <p>No expenses in this group yet. Start by adding one!</p>
//             </div>
//           ) : (
//             expenses.slice().reverse().map(expense => {
//               const payer = getMember(expense.payerId);
//               return (
//                 <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
//                   <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg min-w-[60px]">
//                     <span className="text-[10px] uppercase font-bold text-slate-400">{new Date(expense.date).toLocaleString('default', { month: 'short' })}</span>
//                     <span className="text-lg font-bold text-slate-700">{new Date(expense.date).getDate()}</span>
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="font-bold text-slate-800">{expense.description}</h4>
//                     <p className="text-xs text-slate-500">Paid by {payer?.name}</p>
//                     <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full uppercase">
//                       {expense.category} • {expense.splitType.toLowerCase()}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-slate-800">${expense.amount.toFixed(2)}</p>
//                     <p className="text-xs text-slate-400">Total cost</p>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <h3 className="text-lg font-bold text-slate-800 mb-4">Balances</h3>
//             {balances.length === 0 ? (
//               <p className="text-slate-400 text-sm italic">All settled up!</p>
//             ) : (
//               <div className="space-y-4">
//                 {balances.map((b, idx) => {
//                   const from = getMember(b.fromUserId);
//                   const to = getMember(b.toUserId);
//                   return (
//                     <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0">
//                       <div className="flex justify-between items-center text-sm">
//                         <span className="text-slate-600 font-medium">{from?.name.split(' ')[0]}</span>
//                         <div className="flex-1 border-t border-dotted border-slate-300 mx-2 mt-1"></div>
//                         <span className="text-slate-600 font-medium">{to?.name.split(' ')[0]}</span>
//                       </div>
//                       <div className="flex justify-center">
//                         <span className="text-sm font-bold text-indigo-600">${b.amount.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupDetail;





// import React, { useState } from 'react';
// import { Group, Expense, User, SplitType } from '../types';
// import { calculateGroupBalances } from '../utils/balanceCalculator';

// interface GroupDetailProps {
//   group: Group;
//   expenses: Expense[];
//   users: User[];
//   currentUser: User;
//   onAddExpense: () => void;
//   onAddMember: (uid: string) => void;
//   onSettle: (expense: Partial<Expense>) => void;
// }

// const GroupDetail: React.FC<GroupDetailProps> = ({ 
//   group, 
//   expenses, 
//   users, 
//   currentUser, 
//   onAddExpense, 
//   onAddMember,
//   onSettle
// }) => {
//   const [newMemberId, setNewMemberId] = useState('');
//   const balances = calculateGroupBalances(expenses, group.members);
  
//   const getMember = (id: string) => users.find(u => u.id === id);

//   const handleSettle = (fromId: string, toId: string, amount: number) => {
//     // A settlement is an expense where the person who owes money (fromId) pays the person they owe (toId).
//     // If fromId is current user, they are the Payer.
//     // If fromId is NOT current user, we can't record it unless we assume they already paid.
//     // For this app, we'll allow current user to record any settlement in their group.
//     onSettle({
//       groupId: group.id || (group as any)._id,
//       description: `Settlement: ${getMember(fromId)?.name} → ${getMember(toId)?.name}`,
//       amount: amount,
//       payerId: fromId,
//       splitType: SplitType.EXACT,
//       category: 'Settlement',
//       splits: [{ userId: toId, amount: amount }]
//     });
//   };

//   const handleAddMember = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMemberId.trim()) return;
//     onAddMember(newMemberId);
//     setNewMemberId('');
//   };

//   return (
//     <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
//       <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
//         <div>
//           <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Group Space</nav>
//           <h2 className="text-4xl font-black text-slate-800 tracking-tight">{group.name}</h2>
//           <div className="flex items-center gap-4 mt-4">
//             <div className="flex -space-x-3 overflow-hidden">
//               {group.members.map(mid => {
//                 const u = getMember(mid);
//                 return u ? <img key={mid} src={u.avatar} title={u.name} className="w-10 h-10 rounded-full border-4 border-slate-50 shadow-sm" alt={u.name} /> : null;
//               })}
//             </div>
//             <div className="h-4 w-px bg-slate-200"></div>
//             <p className="text-sm font-semibold text-slate-500">{group.members.length} participants</p>
//           </div>
//         </div>
//         <div className="flex gap-3">
//            <button 
//             onClick={onAddExpense}
//             className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
//             Add Expense
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Main Feed */}
//         <div className="lg:col-span-8 space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xl font-bold text-slate-800">Transaction History</h3>
//           </div>

//           {expenses.length === 0 ? (
//             <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
//               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
//               </div>
//               <p className="text-slate-400 font-medium text-lg">Clean slate! No expenses recorded.</p>
//               <button onClick={onAddExpense} className="mt-4 text-indigo-600 font-bold hover:underline">Create the first one</button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {expenses.slice().sort((a,b) => b.date - a.date).map(expense => {
//                 const payer = getMember(expense.payerId);
//                 const isSettlement = expense.category === 'Settlement';
//                 return (
//                   <div key={expense.id} className={`group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-md hover:border-indigo-100 ${isSettlement ? 'bg-indigo-50/30 border-dashed border-indigo-200' : ''}`}>
//                     <div className="flex flex-col items-center justify-center p-2.5 bg-slate-50 rounded-2xl min-w-[70px] border border-slate-100">
//                       <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{new Date(expense.date).toLocaleString('default', { month: 'short' })}</span>
//                       <span className="text-xl font-black text-slate-800">{new Date(expense.date).getDate()}</span>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <h4 className={`font-bold ${isSettlement ? 'text-indigo-700 italic' : 'text-slate-800'}`}>{expense.description}</h4>
//                         {isSettlement && <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Settlement</span>}
//                       </div>
//                       <p className="text-xs text-slate-500 font-medium">Paid by <span className="text-slate-800 font-bold">{payer?.name || 'Unknown'}</span></p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded-lg uppercase tracking-wider border border-slate-200/50">
//                           {expense.category || 'Other'}
//                         </span>
//                         <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-400 rounded-lg uppercase tracking-wider">
//                           {expense.splitType.toLowerCase()}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className={`text-xl font-black ${isSettlement ? 'text-indigo-600' : 'text-slate-800'}`}>${expense.amount.toFixed(2)}</p>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total Cost</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Sidebar Balances & Members */}
//         <div className="lg:col-span-4 space-y-6">
//           {/* Simplified Balances Card */}
//           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
//             <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
//               <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
//               Group Balances
//             </h3>
            
//             {balances.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
//                 </div>
//                 <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">All settled up!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {balances.map((b, idx) => {
//                   const from = getMember(b.fromUserId);
//                   const to = getMember(b.toUserId);
//                   const isUserInvolved = b.fromUserId === currentUser.id || b.toUserId === currentUser.id;
                  
//                   return (
//                     <div key={idx} className={`p-4 rounded-2xl border ${isUserInvolved ? 'bg-indigo-50/20 border-indigo-100' : 'bg-slate-50/50 border-slate-100'} transition-all hover:scale-[1.02]`}>
//                       <div className="flex justify-between items-center mb-3">
//                         <div className="flex flex-col">
//                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Debtor</span>
//                           <span className="text-sm font-bold text-slate-800">{from?.name.split(' ')[0]}</span>
//                         </div>
//                         <div className="flex-1 flex flex-col items-center px-2">
//                           <span className="text-sm font-black text-indigo-600 tracking-tighter">${b.amount.toFixed(2)}</span>
//                           <div className="w-full h-[2px] bg-indigo-100 relative mt-1">
//                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
//                           </div>
//                         </div>
//                         <div className="flex flex-col items-end">
//                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Creditor</span>
//                           <span className="text-sm font-bold text-slate-800">{to?.name.split(' ')[0]}</span>
//                         </div>
//                       </div>
                      
//                       <button 
//                         onClick={() => handleSettle(b.fromUserId, b.toUserId, b.amount)}
//                         className="w-full py-2 bg-white border border-slate-200 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
//                       >
//                         Settle Up
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Member Management Card */}
//           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
//             <h3 className="text-lg font-extrabold text-slate-800 mb-6">Group Members</h3>
//             <div className="space-y-4 mb-6">
//               {group.members.map(mid => {
//                 const u = getMember(mid);
//                 if (!u) return null;
//                 return (
//                   <div key={mid} className="flex items-center gap-3">
//                     <img src={u.avatar} className="w-8 h-8 rounded-full bg-slate-100" alt={u.name} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{u.name}</p>
//                       <p className="text-[10px] text-slate-400 font-semibold">{u.email}</p>
//                     </div>
//                     {mid === currentUser.id && <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase">You</span>}
//                   </div>
//                 );
//               })}
//             </div>

//             <form onSubmit={handleAddMember} className="space-y-2">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Add new member</p>
//               <div className="flex gap-2">
//                 <input 
//                   type="text" 
//                   placeholder="Paste User ID..." 
//                   className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
//                   value={newMemberId}
//                   onChange={(e) => setNewMemberId(e.target.value)}
//                 />
//                 <button 
//                   type="submit" 
//                   className="bg-slate-800 text-white p-2 rounded-xl hover:bg-black transition-colors"
//                   title="Add Member"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
//                 </button>
//               </div>
//               <p className="text-[8px] text-slate-400 italic mt-1">* In demo, try adding "demo-user-123"</p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupDetail;



import React, { useState } from 'react';
import { Group, Expense, User, SplitType } from '../types';
import { calculateGroupBalances } from '../utils/balanceCalculator';

interface GroupDetailProps {
  group: Group;
  expenses: Expense[];
  users: User[];
  currentUser: User;
  onAddExpense: () => void;
  onAddMember: (uid: string) => void;
  onSettle: (expense: Partial<Expense>) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  group,
  expenses,
  users,
  currentUser,
  onAddExpense,
  onAddMember,
  onSettle
}) => {
  const [newMemberName, setNewMemberName] = useState('');

  const balances = calculateGroupBalances(expenses, group.members);

  const getMember = (id: string) => users.find(u => u.id === id);

  /* ===========================
     SETTLEMENT HANDLER
  =========================== */
  const handleSettle = (fromId: string, toId: string, amount: number) => {
    onSettle({
      groupId: group.id || (group as any)._id,
      description: `Settlement: ${getMember(fromId)?.name} → ${getMember(toId)?.name}`,
      amount,
      payerId: fromId,
      splitType: SplitType.EXACT,
      category: 'Settlement',
      splits: [{ userId: toId, amount }]
    });
  };

  /* ===========================
     ADD MEMBER
  =========================== */
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName);
    setNewMemberName('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Group Space
          </nav>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            {group.name}
          </h2>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-3">
              {group.members.map(mid => {
                const u = getMember(mid);
                return u ? (
                  <img
                    key={mid}
                    src={u.avatar}
                    title={u.name}
                    className="w-10 h-10 rounded-full border-4 border-slate-50"
                    alt={u.name}
                  />
                ) : null;
              })}
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {group.members.length} participants
            </p>
          </div>
        </div>

        <button
          onClick={onAddExpense}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700"
        >
          + Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ================= EXPENSE LIST ================= */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">
            Transaction History
          </h3>

          {expenses.length === 0 ? (
            <div className="bg-white border-dashed border-2 p-12 rounded-3xl text-center">
              <p className="text-slate-400 font-medium">
                No expenses yet.
              </p>
              <button
                onClick={onAddExpense}
                className="mt-4 text-indigo-600 font-bold"
              >
                Add the first one
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses
                .slice()
                .sort((a, b) => b.date - a.date)
                .map(expense => {
                  const payer = getMember(expense.payerId);
                  const isSettlement = expense.category === 'Settlement';

                  return (
                    <div
                      key={expense.id}
                      className={`bg-white p-5 rounded-2xl border ${
                        isSettlement ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100'
                      }`}
                    >
                      <h4 className="font-bold text-slate-800">
                        {expense.description}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Paid by {payer?.name || 'Unknown'}
                      </p>
                      <p className="text-lg font-black text-right mt-2">
                        ${expense.amount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}

              {/* ( ...... ) */}
            </div>
          )}
        </div>

        {/* ================= BALANCES & MEMBERS ================= */}
        <div className="lg:col-span-4 space-y-6">

          {/* BALANCES */}
          <div className="bg-white p-6 rounded-3xl border">
            <h3 className="text-lg font-extrabold mb-4">
              Balance Summary
            </h3>

            {balances.length === 0 ? (
              <p className="text-slate-400 text-center">
                All settled up!
              </p>
            ) : (
              <div className="space-y-4">
                {balances.map((b, idx) => {
                  const from = getMember(b.fromUserId);
                  const to = getMember(b.toUserId);

                  return (
                    <div key={idx} className="p-4 border rounded-xl">
                      <p className="text-sm font-bold">
                        {from?.name} → {to?.name}
                      </p>
                      <p className="text-indigo-600 font-black">
                        ${b.amount.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleSettle(b.fromUserId, b.toUserId, b.amount)}
                        className="mt-2 w-full bg-indigo-600 text-white py-1.5 rounded-lg text-xs font-bold"
                      >
                        Settle
                      </button>
                    </div>
                  );
                })}

                {/* ( ...... ) */}
              </div>
            )}
          </div>

          {/* MEMBERS */}
          <div className="bg-white p-6 rounded-3xl border">
            <h3 className="text-lg font-extrabold mb-4">
              Group Members
            </h3>

            <div className="space-y-3 mb-6">
              {group.members.map(mid => {
                const u = getMember(mid);
                if (!u) return null;

                return (
                  <div key={mid} className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={u.name}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{u.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {u.email}
                      </p>
                    </div>
                    {mid === currentUser.id && (
                      <span className="text-[8px] bg-indigo-100 text-indigo-600 px-2 rounded">
                        You
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="text"
                placeholder="Add by name or email"
                className="flex-1 border rounded-xl px-3 py-2 text-xs"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 rounded-xl"
              >
                +
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
