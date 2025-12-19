
// import React, { useState, useEffect } from 'react';
// import { Group, User, Expense, SplitType, ExpenseSplit } from '../types';

// interface AddExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   group: Group;
//   users: User[];
//   onSubmit: (data: Partial<Expense>) => void;
// }

// const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, group, users, onSubmit }) => {
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState<number>(0);
//   const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL);
//   const [customSplits, setCustomSplits] = useState<Record<string, number>>({});

//   const members = group.members.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

//   useEffect(() => {
//     // Reset custom splits when type or amount changes
//     if (splitType === SplitType.EXACT) {
//       // Fix: Explicitly type the initial object to Record<string, number>
//       const initial: Record<string, number> = {};
//       members.forEach(m => initial[m.id] = 0);
//       setCustomSplits(initial);
//     } else if (splitType === SplitType.PERCENTAGE) {
//       // Fix: Explicitly type the initial object to Record<string, number>
//       const initial: Record<string, number> = {};
//       const equalPerc = 100 / members.length;
//       members.forEach(m => initial[m.id] = equalPerc);
//       setCustomSplits(initial);
//     }
//   }, [splitType, members.length]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!description || amount <= 0) return;

//     let finalSplits: ExpenseSplit[] = [];
    
//     if (splitType === SplitType.EQUAL) {
//       const splitAmount = amount / members.length;
//       finalSplits = members.map(m => ({ userId: m.id, amount: splitAmount }));
//     } else if (splitType === SplitType.EXACT) {
//       // Fix: Explicitly type reduce parameters to resolve unknown type and arithmetic errors (Lines 45-46)
//       const sum = Object.values(customSplits).reduce((a: number, b: number) => a + b, 0);
//       if (Math.abs(sum - amount) > 0.01) {
//         alert("Exact amounts must sum up to the total.");
//         return;
//       }
//       finalSplits = members.map(m => ({ userId: m.id, amount: customSplits[m.id] || 0 }));
//     } else if (splitType === SplitType.PERCENTAGE) {
//       // Fix: Explicitly type reduce parameters to resolve unknown type and arithmetic errors (Lines 52-53)
//       const sum = Object.values(customSplits).reduce((a: number, b: number) => a + b, 0);
//       if (Math.abs(sum - 100) > 0.01) {
//         alert("Percentages must sum up to 100%.");
//         return;
//       }
//       finalSplits = members.map(m => ({ 
//         userId: m.id, 
//         amount: (customSplits[m.id] / 100) * amount,
//         percentage: customSplits[m.id]
//       }));
//     }

//     onSubmit({
//       description,
//       amount,
//       splitType,
//       splits: finalSplits,
//       groupId: group.id
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
//         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//           <h3 className="text-xl font-bold text-slate-800">Add an expense</h3>
//           <button onClick={onClose} className="p-1 hover:bg-white rounded-full transition-colors">
//             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
//               </div>
//               <input 
//                 autoFocus
//                 type="text" 
//                 placeholder="Enter a description" 
//                 className="flex-1 text-lg font-medium border-b-2 border-slate-100 focus:border-indigo-600 outline-none pb-1 transition-colors"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl">$</div>
//               <input 
//                 type="number" 
//                 placeholder="0.00" 
//                 className="flex-1 text-3xl font-bold border-b-2 border-slate-100 focus:border-indigo-600 outline-none pb-1 transition-colors"
//                 value={amount || ''}
//                 onChange={(e) => setAmount(Number(e.target.value))}
//                 step="0.01"
//                 required
//               />
//             </div>
//           </div>

//           <div className="p-4 bg-slate-50 rounded-2xl">
//             <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Paid by you and split...</p>
//             <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-100 mb-4">
//               {[SplitType.EQUAL, SplitType.EXACT, SplitType.PERCENTAGE].map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => setSplitType(type)}
//                   className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${splitType === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
//               {members.map(user => (
//                 <div key={user.id} className="flex items-center gap-3">
//                   <img src={user.avatar} className="w-6 h-6 rounded-full" alt={user.name} />
//                   <span className="flex-1 text-sm font-medium text-slate-700">{user.name}</span>
//                   {splitType === SplitType.EQUAL ? (
//                     <span className="text-sm font-bold text-slate-400">${(amount / members.length).toFixed(2)}</span>
//                   ) : (
//                     <div className="relative w-24">
//                       <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{splitType === SplitType.PERCENTAGE ? '%' : '$'}</span>
//                       <input 
//                         type="number"
//                         className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
//                         value={customSplits[user.id] || 0}
//                         onChange={(e) => setCustomSplits(prev => ({ ...prev, [user.id]: Number(e.target.value) }))}
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
//           >
//             Save Expense
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddExpenseModal;



// import React, { useState, useEffect } from 'react';
// import { Group, User, Expense, SplitType, ExpenseSplit } from '../types';

// interface AddExpenseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   group: Group;
//   users: User[];
//   onSubmit: (data: Partial<Expense>) => void;
// }

// const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
//   isOpen,
//   onClose,
//   group,
//   users,
//   onSubmit
// }) => {
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState<number>(0);
//   const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL);

//   /* ✅ NEW: WHO PAID */
//   const [payerId, setPayerId] = useState<string>(group.members[0]);

//   const [customSplits, setCustomSplits] = useState<Record<string, number>>({});

//   const members = group.members
//     .map(id => users.find(u => u.id === id))
//     .filter(Boolean) as User[];

//   /* ===========================
//      RESET SPLITS WHEN TYPE CHANGES
//   =========================== */
//   useEffect(() => {
//     const initial: Record<string, number> = {};

//     if (splitType === SplitType.EXACT) {
//       members.forEach(m => (initial[m.id] = 0));
//       setCustomSplits(initial);
//     }

//     if (splitType === SplitType.PERCENTAGE) {
//       const equalPerc = 100 / members.length;
//       members.forEach(m => (initial[m.id] = equalPerc));
//       setCustomSplits(initial);
//     }
//   }, [splitType, members.length]);

//   /* ===========================
//      SUBMIT HANDLER
//   =========================== */
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!description || amount <= 0) return;

//     let finalSplits: ExpenseSplit[] = [];

//     if (splitType === SplitType.EQUAL) {
//       const splitAmount = amount / members.length;
//       finalSplits = members.map(m => ({
//         userId: m.id,
//         amount: splitAmount
//       }));
//     }

//     if (splitType === SplitType.EXACT) {
//       const sum = Object.values(customSplits).reduce(
//         (a: number, b: number) => a + b,
//         0
//       );
//       if (Math.abs(sum - amount) > 0.01) {
//         alert('Exact amounts must sum up to total.');
//         return;
//       }
//       finalSplits = members.map(m => ({
//         userId: m.id,
//         amount: customSplits[m.id] || 0
//       }));
//     }

//     if (splitType === SplitType.PERCENTAGE) {
//       const sum = Object.values(customSplits).reduce(
//         (a: number, b: number) => a + b,
//         0
//       );
//       if (Math.abs(sum - 100) > 0.01) {
//         alert('Percentages must sum up to 100%.');
//         return;
//       }
//       finalSplits = members.map(m => ({
//         userId: m.id,
//         amount: (customSplits[m.id] / 100) * amount,
//         percentage: customSplits[m.id]
//       }));
//     }

//     onSubmit({
//       groupId: group.id,
//       description,
//       amount,
//       payerId,               // ✅ SELECTED PAYER
//       splitType,
//       splits: finalSplits
//     });

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
//         <div className="p-6 border-b flex justify-between items-center bg-slate-50">
//           <h3 className="text-xl font-bold text-slate-800">Add an expense</h3>
//           <button onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* DESCRIPTION */}
//           <input
//             autoFocus
//             placeholder="Expense description"
//             className="w-full text-lg font-medium border-b"
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//             required
//           />

//           {/* AMOUNT */}
//           <input
//             type="number"
//             placeholder="0.00"
//             className="w-full text-3xl font-bold border-b"
//             value={amount || ''}
//             onChange={e => setAmount(Number(e.target.value))}
//             required
//           />

//           {/* ✅ WHO PAID */}
//           <div>
//             <p className="text-xs font-bold text-slate-500 mb-1 uppercase">
//               Paid by
//             </p>
//             <select
//               value={payerId}
//               onChange={e => setPayerId(e.target.value)}
//               className="w-full border rounded-xl px-3 py-2"
//             >
//               {members.map(m => (
//                 <option key={m.id} value={m.id}>
//                   {m.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SPLIT TYPE */}
//           <div className="flex gap-2">
//             {[SplitType.EQUAL, SplitType.EXACT, SplitType.PERCENTAGE].map(t => (
//               <button
//                 key={t}
//                 type="button"
//                 onClick={() => setSplitType(t)}
//                 className={`flex-1 py-2 rounded-xl text-xs font-bold ${
//                   splitType === t
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-slate-100'
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>

//           {/* SPLITS */}
//           <div className="space-y-2">
//             {members.map(m => (
//               <div key={m.id} className="flex items-center gap-3">
//                 <span className="flex-1 text-sm">{m.name}</span>

//                 {splitType === SplitType.EQUAL ? (
//                   <span className="text-sm font-bold">
//                     ${(amount / members.length).toFixed(2)}
//                   </span>
//                 ) : (
//                   <input
//                     type="number"
//                     className="w-24 border rounded-lg px-2 py-1 text-sm"
//                     value={customSplits[m.id] || 0}
//                     onChange={e =>
//                       setCustomSplits(prev => ({
//                         ...prev,
//                         [m.id]: Number(e.target.value)
//                       }))
//                     }
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
//           >
//             Save Expense
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddExpenseModal;



import React, { useState, useEffect } from 'react';
import { Group, User, Expense, SplitType, ExpenseSplit } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  users: User[];
  onSubmit: (data: Partial<Expense>) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  group,
  users,
  onSubmit
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL);

  /* ✅ CATEGORY (CRITICAL FIX) */
  const [category, setCategory] = useState<string>('Food');

  /* ✅ WHO PAID */
  const [payerId, setPayerId] = useState<string>(group.members[0]);

  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});

  const members = group.members
    .map(id => users.find(u => u.id === id))
    .filter(Boolean) as User[];

  /* ===========================
     RESET SPLITS WHEN TYPE CHANGES
  =========================== */
  useEffect(() => {
    const initial: Record<string, number> = {};

    if (splitType === SplitType.EXACT) {
      members.forEach(m => (initial[m.id] = 0));
      setCustomSplits(initial);
    }

    if (splitType === SplitType.PERCENTAGE) {
      const equalPerc = 100 / members.length;
      members.forEach(m => (initial[m.id] = equalPerc));
      setCustomSplits(initial);
    }
  }, [splitType, members.length]);

  /* ===========================
     SUBMIT HANDLER
  =========================== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    let finalSplits: ExpenseSplit[] = [];

    if (splitType === SplitType.EQUAL) {
      const splitAmount = amount / members.length;
      finalSplits = members.map(m => ({
        userId: m.id,
        amount: splitAmount
      }));
    }

    if (splitType === SplitType.EXACT) {
      const sum = Object.values(customSplits).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - amount) > 0.01) {
        alert('Exact amounts must sum up to total.');
        return;
      }
      finalSplits = members.map(m => ({
        userId: m.id,
        amount: customSplits[m.id] || 0
      }));
    }

    if (splitType === SplitType.PERCENTAGE) {
      const sum = Object.values(customSplits).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 100) > 0.01) {
        alert('Percentages must sum up to 100%.');
        return;
      }
      finalSplits = members.map(m => ({
        userId: m.id,
        amount: (customSplits[m.id] / 100) * amount,
        percentage: customSplits[m.id]
      }));
    }

    onSubmit({
      groupId: group.id,
      description,
      amount,
      category,        // ✅ ALWAYS SET
      payerId,         // ✅ SELECTED USER
      splitType,
      splits: finalSplits
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Add Expense</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* DESCRIPTION */}
          <input
            autoFocus
            placeholder="Expense description"
            className="w-full text-lg font-medium border-b outline-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          {/* AMOUNT */}
          <input
            type="number"
            placeholder="0.00"
            className="w-full text-3xl font-bold border-b outline-none"
            value={amount || ''}
            onChange={e => setAmount(Number(e.target.value))}
            required
          />

          {/* CATEGORY */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 uppercase">
              Category
            </p>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
          </div>

          {/* WHO PAID */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1 uppercase">
              Paid by
            </p>
            <select
              value={payerId}
              onChange={e => setPayerId(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* SPLIT TYPE */}
          <div className="flex gap-2">
            {[SplitType.EQUAL, SplitType.EXACT, SplitType.PERCENTAGE].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSplitType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                  splitType === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* SPLITS */}
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="flex-1 text-sm">{m.name}</span>

                {splitType === SplitType.EQUAL ? (
                  <span className="text-sm font-bold">
                    ${(amount / members.length).toFixed(2)}
                  </span>
                ) : (
                  <input
                    type="number"
                    className="w-24 border rounded-lg px-2 py-1 text-sm"
                    value={customSplits[m.id] || 0}
                    onChange={e =>
                      setCustomSplits(prev => ({
                        ...prev,
                        [m.id]: Number(e.target.value)
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
          >
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
