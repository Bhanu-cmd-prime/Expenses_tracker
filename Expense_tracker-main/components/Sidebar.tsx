
// import React, { useState } from 'react';
// import { Group, User } from '../types';
// import { auth, signOut } from '../firebase';

// interface SidebarProps {
//   groups: Group[];
//   activeGroupId: string | null;
//   setActiveGroupId: (id: string | null) => void;
//   onAddGroup: (name: string, memberIds: string[]) => void;
//   users: User[];
//   currentUser: User;
// }

// const Sidebar: React.FC<SidebarProps> = ({ groups, activeGroupId, setActiveGroupId, onAddGroup, users, currentUser }) => {
//   const [isAdding, setIsAdding] = useState(false);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

//   const handleSubmitGroup = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newGroupName.trim()) return;
//     onAddGroup(newGroupName, selectedMembers);
//     setNewGroupName('');
//     setSelectedMembers([]);
//     setIsAdding(false);
//   };

//   const handleLogout = () => {
//     if (confirm('Are you sure you want to log out?')) {
//       signOut(auth);
//     }
//   };

//   return (
//     <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0">
//       <div className="p-6 border-b border-slate-100">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
//             <h1 className="text-xl font-bold text-slate-800">SplitSmart</h1>
//           </div>
//           <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//           </button>
//         </div>
        
//         <button 
//           onClick={() => setActiveGroupId(null)}
//           className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeGroupId === null ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
//           <span className="font-medium">Dashboard</span>
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="flex items-center justify-between mb-4 px-2">
//           <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Groups</h2>
//           <button 
//             onClick={() => setIsAdding(!isAdding)}
//             className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
//           </button>
//         </div>

//         {isAdding && (
//           <form onSubmit={handleSubmitGroup} className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
//             <input 
//               autoFocus
//               className="w-full text-sm p-2 mb-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
//               placeholder="Group name"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//             />
//             <div className="flex gap-2">
//               <button type="submit" className="flex-1 text-xs bg-indigo-600 text-white py-1.5 rounded-md hover:bg-indigo-700 font-medium">Create</button>
//               <button type="button" onClick={() => setIsAdding(false)} className="flex-1 text-xs bg-slate-200 text-slate-600 py-1.5 rounded-md hover:bg-slate-300 font-medium">Cancel</button>
//             </div>
//           </form>
//         )}

//         <div className="space-y-1">
//           {groups.map(group => {
//             const gId = group.id || (group as any)._id;
//             return (
//               <button
//                 key={gId}
//                 onClick={() => setActiveGroupId(gId)}
//                 className={`w-full text-left px-3 py-2 rounded-lg transition-all ${activeGroupId === gId ? 'bg-white shadow-sm border border-slate-200 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:pl-4 border border-transparent'}`}
//               >
//                 <span className="font-medium text-sm truncate block">{group.name}</span>
//                 <span className="text-[10px] text-slate-400">{group.members.length} members</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="p-4 border-t border-slate-100">
//         <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
//           <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full ring-2 ring-white bg-white" />
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.name}</p>
//             <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;




import React, { useState, useMemo } from 'react';
import { Group, User, Expense } from '../types';
import { calculateGroupBalances } from '../utils/balanceCalculator';

interface SidebarProps {
  groups: Group[];
  expenses: Expense[];
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  onAddGroup: (name: string, memberIds: string[]) => void;
  users: User[];
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  groups,
  expenses,
  activeGroupId,
  setActiveGroupId,
  onAddGroup,
  users,
  currentUser,
  onLogout
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  /* ===========================
     GROUP BALANCE CALCULATION
  =========================== */
  const groupBalances = useMemo(() => {
    return groups.reduce((acc, group) => {
      const gId = group.id || (group as any)._id;
      const gExpenses = expenses.filter(e => e.groupId === gId);
      const balances = calculateGroupBalances(gExpenses, group.members);

      let net = 0;
      balances.forEach(b => {
        if (b.fromUserId === currentUser.id) net -= b.amount;
        if (b.toUserId === currentUser.id) net += b.amount;
      });

      acc[gId] = net;
      return acc;
    }, {} as Record<string, number>);
  }, [groups, expenses, currentUser.id]);

  /* ===========================
     CREATE GROUP
  =========================== */
  const handleSubmitGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onAddGroup(newGroupName, []);
    setNewGroupName('');
    setIsAdding(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0">

      {/* ================= HEADER ================= */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              S
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              SplitSmart
            </h1>
          </div>

          {/* ✅ CORRECT LOGOUT ICON */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setActiveGroupId(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeGroupId === null
              ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Dashboard
        </button>
      </div>

      {/* ================= GROUP LIST ================= */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
            Groups
          </h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-all"
          >
            +
          </button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleSubmitGroup}
            className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200"
          >
            <input
              autoFocus
              className="w-full text-sm p-2 mb-2 bg-white border border-slate-200 rounded-md"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 text-[10px] bg-indigo-600 text-white py-1.5 rounded-md font-bold"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 text-[10px] bg-slate-200 text-slate-600 py-1.5 rounded-md font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-1">
          {groups.map(group => {
            const gId = group.id || (group as any)._id;
            const balance = groupBalances[gId] || 0;

            return (
              <button
                key={gId}
                onClick={() => setActiveGroupId(gId)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                  activeGroupId === gId
                    ? 'bg-white shadow-md border border-slate-100 text-indigo-600 translate-x-1'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-bold text-sm truncate">
                    {group.name}
                  </span>

                  {balance !== 0 && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        balance > 0
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {balance > 0 ? 'Owed' : 'Owe'}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {group.members.length} members
                  </span>

                  {balance !== 0 && (
                    <span
                      className={`text-[10px] font-bold ${
                        balance > 0
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      ${Math.abs(balance).toFixed(0)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* ( ...... ) */}
        </div>
      </div>

      {/* ================= USER ================= */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full ring-2 ring-white bg-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase truncate">
              Active User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
