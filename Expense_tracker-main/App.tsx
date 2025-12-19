
// import React, { useState, useEffect, useMemo } from 'react';
// import { User, Group, Expense } from './types';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import GroupDetail from './components/GroupDetail';
// import AddExpenseModal from './components/AddExpenseModal';
// import Auth from './components/Auth';
// import { categorizeExpense } from './services/geminiService';
// import { api } from './services/api';
// import { auth, onAuthStateChanged, signOut } from './firebase';

// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user && !isDemoMode) {
//         setCurrentUser({
//           id: user.uid,
//           name: user.displayName || 'Guest',
//           email: user.email || '',
//           avatar: `https://picsum.photos/seed/${user.uid}/100`
//         });
//       } else if (!isDemoMode) {
//         setCurrentUser(null);
//       }
//       setIsAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, [isDemoMode]);

//   useEffect(() => {
//     if (!currentUser) return;

//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         const [fetchedGroups, fetchedExpenses] = await Promise.all([
//           api.getGroups(),
//           api.getExpenses()
//         ]);
//         setGroups(fetchedGroups);
//         setExpenses(fetchedExpenses);
//       } catch (error) {
//         console.warn("Backend connection failed, demo persistence enabled.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, [currentUser]);

//   const handleDemoLogin = (user: User) => {
//     setIsDemoMode(true);
//     setCurrentUser(user);
//     setIsAuthLoading(false);
//     // Initialize with some dummy data for demo
//     setGroups([{ id: 'demo-g1', name: 'Weekend Trip', members: [user.id], createdAt: Date.now() }]);
//   };

//   const handleLogout = () => {
//     if (isDemoMode) {
//       setCurrentUser(null);
//       setIsDemoMode(false);
//     } else {
//       signOut(auth);
//     }
//   };

//   const addGroup = async (name: string, memberIds: string[]) => {
//     if (!currentUser) return;
//     try {
//       const newGroup = await api.createGroup(name, [...new Set([currentUser.id, ...memberIds])]);
//       setGroups(prev => [...prev, newGroup]);
//     } catch (error) {
//       if (isDemoMode) {
//         const mockGroup = { id: Math.random().toString(), name, members: [currentUser.id, ...memberIds], createdAt: Date.now() };
//         setGroups(prev => [...prev, mockGroup]);
//       }
//     }
//   };

//   const addExpense = async (expenseData: Partial<Expense>) => {
//     if (!currentUser) return;
//     try {
//       const category = await categorizeExpense(expenseData.description || '');
//       const newExpense = await api.createExpense({
//         ...expenseData,
//         payerId: currentUser.id,
//         date: Date.now(),
//         category
//       });
//       setExpenses(prev => [...prev, newExpense]);
//       setIsExpenseModalOpen(false);
//     } catch (error) {
//       if (isDemoMode) {
//         const mockExpense: any = { 
//           ...expenseData, 
//           id: Math.random().toString(), 
//           payerId: currentUser.id, 
//           date: Date.now(), 
//           category: 'Other' 
//         };
//         setExpenses(prev => [...prev, mockExpense]);
//         setIsExpenseModalOpen(false);
//       }
//     }
//   };

//   const activeGroup = useMemo(() => 
//     groups.find(g => (g.id === activeGroupId || (g as any)._id === activeGroupId)) || null
//   , [groups, activeGroupId]);

//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Auth onDemoLogin={handleDemoLogin} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar 
//         groups={groups} 
//         activeGroupId={activeGroupId} 
//         setActiveGroupId={setActiveGroupId}
//         onAddGroup={addGroup}
//         users={[currentUser]} 
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />
      
//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         <div className="max-w-6xl mx-auto flex justify-end mb-4 md:hidden">
//            <button onClick={handleLogout} className="text-rose-500 font-bold text-sm">Logout</button>
//         </div>
//         {activeGroupId === null ? (
//           <Dashboard 
//             expenses={expenses} 
//             groups={groups} 
//             users={[currentUser]} 
//             currentUser={currentUser} 
//           />
//         ) : (
//           <GroupDetail 
//             group={activeGroup!} 
//             expenses={expenses.filter(e => e.groupId === activeGroupId)} 
//             users={[currentUser]}
//             currentUser={currentUser}
//             onAddExpense={() => setIsExpenseModalOpen(true)}
//           />
//         )}
//       </main>

//       {isExpenseModalOpen && activeGroup && (
//         <AddExpenseModal 
//           isOpen={isExpenseModalOpen}
//           onClose={() => setIsExpenseModalOpen(false)}
//           group={activeGroup}
//           users={[currentUser]}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// };

// export default App;


// import React, { useState, useEffect, useMemo } from 'react';
// import { User, Group, Expense, SplitType } from './types';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import GroupDetail from './components/GroupDetail';
// import AddExpenseModal from './components/AddExpenseModal';
// import Auth from './components/Auth';
// import { categorizeExpense } from './services/geminiService';
// import { api } from './services/api';
// import { auth, onAuthStateChanged, signOut } from './firebase';

// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user && !isDemoMode) {
//         setCurrentUser({
//           id: user.uid,
//           name: user.displayName || 'Guest',
//           email: user.email || '',
//           avatar: `https://picsum.photos/seed/${user.uid}/100`
//         });
//       } else if (!isDemoMode) {
//         setCurrentUser(null);
//       }
//       setIsAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, [isDemoMode]);

//   useEffect(() => {
//     if (!currentUser || isDemoMode) return;

//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         const [fetchedGroups, fetchedExpenses] = await Promise.all([
//           api.getGroups(),
//           api.getExpenses()
//         ]);
//         setGroups(fetchedGroups);
//         setExpenses(fetchedExpenses);
//       } catch (error) {
//         console.warn("Backend connection failed, staying in offline/demo mode.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, [currentUser, isDemoMode]);

//   const handleDemoLogin = (user: User) => {
//     setIsDemoMode(true);
//     setCurrentUser(user);
//     setIsAuthLoading(false);

//     const demoGroupId1 = 'demo-g1';
//     const demoGroupId2 = 'demo-g2';
//     const otherUserId = 'demo-user-999';

    // const demoGroups: Group[] = [
    //   { id: demoGroupId1, name: 'Goa Summer Trip', members: [user.id, otherUserId], createdAt: Date.now() - 604800000 },
    //   { id: demoGroupId2, name: 'Flatmates - Unit 402', members: [user.id, otherUserId], createdAt: Date.now() - 1209600000 }
    // ];

//     const now = Date.now();
//     const day = 86400000;

    // const demoExpenses: Expense[] = [
    //   {
    //     id: 'e1', groupId: demoGroupId2, payerId: user.id, description: 'Monthly Apartment Rent', amount: 1200, date: now - 5 * day, category: 'Utilities', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 600 }, { userId: otherUserId, amount: 600 }]
    //   },
    //   {
    //     id: 'e2', groupId: demoGroupId1, payerId: user.id, description: 'Flight Tickets', amount: 450, date: now - 4 * day, category: 'Transport', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 225 }, { userId: otherUserId, amount: 225 }]
    //   },
    //   {
    //     id: 'e3', groupId: demoGroupId1, payerId: otherUserId, description: 'Resort Stay Deposit', amount: 300, date: now - 3 * day, category: 'Other', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 150 }, { userId: otherUserId, amount: 150 }]
    //   },
    //   {
    //     id: 'e4', groupId: demoGroupId2, payerId: user.id, description: 'Grocery Run - Whole Foods', amount: 85.50, date: now - 2 * day, category: 'Food', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 42.75 }, { userId: otherUserId, amount: 42.75 }]
    //   },
    //   {
    //     id: 'e5', groupId: demoGroupId1, payerId: user.id, description: 'Dinner at Thalassa', amount: 140, date: now - 1 * day, category: 'Food', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 70 }, { userId: otherUserId, amount: 70 }]
    //   },
    //   {
    //     id: 'e6', groupId: demoGroupId2, payerId: otherUserId, description: 'Electricity & Water', amount: 95, date: now - 12 * day, category: 'Utilities', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 47.5 }, { userId: otherUserId, amount: 47.5 }]
    //   },
    //   {
    //     id: 'e7', groupId: demoGroupId1, payerId: user.id, description: 'Uber to Airport', amount: 45, date: now - 4 * day - 3600000, category: 'Transport', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 22.5 }, { userId: otherUserId, amount: 22.5 }]
    //   },
    //   {
    //     id: 'e8', groupId: demoGroupId2, payerId: user.id, description: 'Netflix Subscription', amount: 15.99, date: now - 10 * day, category: 'Entertainment', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 7.99 }, { userId: otherUserId, amount: 8 }]
    //   },
    //   {
    //     id: 'e9', groupId: demoGroupId2, payerId: otherUserId, description: 'Gym Membership', amount: 60, date: now - 15 * day, category: 'Health', splitType: SplitType.EXACT,
    //     splits: [{ userId: user.id, amount: 30 }, { userId: otherUserId, amount: 30 }]
    //   },
    //   {
    //     id: 'e10', groupId: demoGroupId1, payerId: user.id, description: 'Scuba Diving Session', amount: 200, date: now - 2 * day + 7200000, category: 'Entertainment', splitType: SplitType.EQUAL,
    //     splits: [{ userId: user.id, amount: 100 }, { userId: otherUserId, amount: 100 }]
    //   }
    // ];

//     setGroups(demoGroups);
//     setExpenses(demoExpenses);
//     setIsLoading(false);
//   };

//   const handleLogout = () => {
//     if (isDemoMode) {
//       setCurrentUser(null);
//       setIsDemoMode(false);
//       setGroups([]);
//       setExpenses([]);
//     } else {
//       signOut(auth);
//     }
//   };

//   const addGroup = async (name: string, memberIds: string[]) => {
//     if (!currentUser) return;
//     try {
//       const newGroup = await api.createGroup(name, [...new Set([currentUser.id, ...memberIds])]);
//       setGroups(prev => [...prev, newGroup]);
//     } catch (error) {
//       if (isDemoMode) {
//         const mockGroup = { id: Math.random().toString(), name, members: [currentUser.id, ...memberIds], createdAt: Date.now() };
//         setGroups(prev => [...prev, mockGroup]);
//       }
//     }
//   };

//   const addExpense = async (expenseData: Partial<Expense>) => {
//     if (!currentUser) return;
//     try {
//       const category = await categorizeExpense(expenseData.description || '');
//       const newExpense = await api.createExpense({
//         ...expenseData,
//         payerId: currentUser.id,
//         date: Date.now(),
//         category
//       });
//       setExpenses(prev => [...prev, newExpense]);
//       setIsExpenseModalOpen(false);
//     } catch (error) {
//       if (isDemoMode) {
//         const mockExpense: any = { 
//           ...expenseData, 
//           id: Math.random().toString(), 
//           payerId: currentUser.id, 
//           date: Date.now(), 
//           category: expenseData.category || 'Other' 
//         };
//         setExpenses(prev => [...prev, mockExpense]);
//         setIsExpenseModalOpen(false);
//       }
//     }
//   };

//   const activeGroup = useMemo(() => 
//     groups.find(g => (g.id === activeGroupId || (g as any)._id === activeGroupId)) || null
//   , [groups, activeGroupId]);

//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Auth onDemoLogin={handleDemoLogin} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar 
//         groups={groups} 
//         activeGroupId={activeGroupId} 
//         setActiveGroupId={setActiveGroupId}
//         onAddGroup={addGroup}
//         users={[currentUser]} 
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />
      
//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         <div className="max-w-6xl mx-auto flex justify-end mb-4 md:hidden">
//            <button onClick={handleLogout} className="text-rose-500 font-bold text-sm">Logout</button>
//         </div>
//         {activeGroupId === null ? (
//           <Dashboard 
//             expenses={expenses} 
//             groups={groups} 
//             users={[currentUser]} 
//             currentUser={currentUser} 
//           />
//         ) : (
//           <GroupDetail 
//             group={activeGroup!} 
//             expenses={expenses.filter(e => e.groupId === activeGroupId)} 
//             users={[currentUser]}
//             currentUser={currentUser}
//             onAddExpense={() => setIsExpenseModalOpen(true)}
//           />
//         )}
//       </main>

//       {isExpenseModalOpen && activeGroup && (
//         <AddExpenseModal 
//           isOpen={isExpenseModalOpen}
//           onClose={() => setIsExpenseModalOpen(false)}
//           group={activeGroup}
//           users={[currentUser]}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// };

// export default App;


// import React, { useState, useEffect, useMemo } from 'react';
// import { User, Group, Expense, SplitType } from './types';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import GroupDetail from './components/GroupDetail';
// import AddExpenseModal from './components/AddExpenseModal';
// import Auth from './components/Auth';

// import { categorizeExpense } from './services/geminiService';
// import { api } from './services/api';
// import { auth, onAuthStateChanged, signOut } from './firebase';

// /* ===========================
//    DEMO DATA GENERATOR
// =========================== */
// const getDemoData = (user: User) => {
//   const demoGroupId = 'demo-g1';
//   const otherUserId = 'demo-user-999';
//   const now = Date.now();
//   const day = 86400000;

//   const demoGroups: Group[] = [
//       { id: demoGroupId, name: 'Goa Summer Trip', members: [user.id, otherUserId], createdAt: Date.now() - 604800000 },
//       { id: demoGroupId, name: 'Flatmates - Unit 402', members: [user.id, otherUserId], createdAt: Date.now() - 1209600000 }
//     ];


//   const demoExpenses: Expense[] = [
//       {
//         id: 'e1', groupId: demoGroupId, payerId: user.id, description: 'Monthly Apartment Rent', amount: 1200, date: now - 5 * day, category: 'Utilities', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 600 }, { userId: otherUserId, amount: 600 }]
//       },
//       {
//         id: 'e2', groupId: demoGroupId, payerId: user.id, description: 'Flight Tickets', amount: 450, date: now - 4 * day, category: 'Transport', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 225 }, { userId: otherUserId, amount: 225 }]
//       },
//       {
//         id: 'e3', groupId: demoGroupId, payerId: otherUserId, description: 'Resort Stay Deposit', amount: 300, date: now - 3 * day, category: 'Other', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 150 }, { userId: otherUserId, amount: 150 }]
//       },
//       {
//         id: 'e4', groupId: demoGroupId, payerId: user.id, description: 'Grocery Run - Whole Foods', amount: 85.50, date: now - 2 * day, category: 'Food', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 42.75 }, { userId: otherUserId, amount: 42.75 }]
//       },
//       {
//         id: 'e5', groupId: demoGroupId, payerId: user.id, description: 'Dinner at Thalassa', amount: 140, date: now - 1 * day, category: 'Food', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 70 }, { userId: otherUserId, amount: 70 }]
//       },
//       {
//         id: 'e6', groupId: demoGroupId, payerId: otherUserId, description: 'Electricity & Water', amount: 95, date: now - 12 * day, category: 'Utilities', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 47.5 }, { userId: otherUserId, amount: 47.5 }]
//       },
//       {
//         id: 'e7', groupId: demoGroupId, payerId: user.id, description: 'Uber to Airport', amount: 45, date: now - 4 * day - 3600000, category: 'Transport', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 22.5 }, { userId: otherUserId, amount: 22.5 }]
//       },
//       {
//         id: 'e8', groupId: demoGroupId, payerId: user.id, description: 'Netflix Subscription', amount: 15.99, date: now - 10 * day, category: 'Entertainment', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 7.99 }, { userId: otherUserId, amount: 8 }]
//       },
//       {
//         id: 'e9', groupId: demoGroupId, payerId: otherUserId, description: 'Gym Membership', amount: 60, date: now - 15 * day, category: 'Health', splitType: SplitType.EXACT,
//         splits: [{ userId: user.id, amount: 30 }, { userId: otherUserId, amount: 30 }]
//       },
//       {
//         id: 'e10', groupId: demoGroupId, payerId: user.id, description: 'Scuba Diving Session', amount: 200, date: now - 2 * day + 7200000, category: 'Entertainment', splitType: SplitType.EQUAL,
//         splits: [{ userId: user.id, amount: 100 }, { userId: otherUserId, amount: 100 }]
//       }
//     ];

//   return { demoGroups, demoExpenses };
// };

// /* ===========================
//    MAIN APP
// =========================== */
// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   /* ===========================
//      AUTH LISTENER
//   =========================== */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const appUser: User = {
//           id: user.uid,
//           name: user.displayName || 'User',
//           email: user.email || '',
//           avatar: `https://picsum.photos/seed/${user.uid}/100`
//         };

//         setCurrentUser(appUser);

//         // ✅ Load demo data for ALL normal users
//         const { demoGroups, demoExpenses } = getDemoData(appUser);
//         setGroups(demoGroups);
//         setExpenses(demoExpenses);
//       } else {
//         setCurrentUser(null);
//       }
//       setIsAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* ===========================
//      BACKEND FETCH (OPTIONAL)
//   =========================== */
//   useEffect(() => {
//     if (!currentUser || isDemoMode) return;

//     const loadBackendData = async () => {
//       try {
//         const [fetchedGroups, fetchedExpenses] = await Promise.all([
//           api.getGroups(),
//           api.getExpenses()
//         ]);

//         if (fetchedGroups.length > 0) {
//           setGroups(fetchedGroups);
//           setExpenses(fetchedExpenses);
//         }
//       } catch (error) {
//         console.warn('Backend unavailable – showing demo data');
//       }
//     };

//     loadBackendData();
//   }, [currentUser, isDemoMode]);

//   /* ===========================
//      DEMO LOGIN
//   =========================== */
//   const handleDemoLogin = (user: User) => {
//     setIsDemoMode(true);
//     setCurrentUser(user);

//     const { demoGroups, demoExpenses } = getDemoData(user);
//     setGroups(demoGroups);
//     setExpenses(demoExpenses);
//     setIsAuthLoading(false);
//   };

//   /* ===========================
//      LOGOUT
//   =========================== */
//   const handleLogout = () => {
//     if (isDemoMode) {
//       setCurrentUser(null);
//       setIsDemoMode(false);
//       setGroups([]);
//       setExpenses([]);
//     } else {
//       signOut(auth);
//     }
//   };

//   /* ===========================
//      ADD GROUP
//   =========================== */
//   const addGroup = async (name: string, memberIds: string[]) => {
//     if (!currentUser) return;

//     try {
//       const newGroup = await api.createGroup(name, [
//         ...new Set([currentUser.id, ...memberIds])
//       ]);
//       setGroups(prev => [...prev, newGroup]);
//     } catch {
//       const mockGroup: Group = {
//         id: Math.random().toString(),
//         name,
//         members: [currentUser.id, ...memberIds],
//         createdAt: Date.now()
//       };
//       setGroups(prev => [...prev, mockGroup]);
//     }
//   };

//   /* ===========================
//      ADD EXPENSE
//   =========================== */
//   const addExpense = async (expenseData: Partial<Expense>) => {
//     if (!currentUser) return;

//     try {
//       const category = await categorizeExpense(expenseData.description || '');
//       const newExpense = await api.createExpense({
//         ...expenseData,
//         payerId: currentUser.id,
//         date: Date.now(),
//         category
//       });

//       setExpenses(prev => [...prev, newExpense]);
//       setIsExpenseModalOpen(false);
//     } catch {
//       const mockExpense: Expense = {
//         ...(expenseData as Expense),
//         id: Math.random().toString(),
//         payerId: currentUser.id,
//         date: Date.now(),
//         category: expenseData.category || 'Other'
//       };
//       setExpenses(prev => [...prev, mockExpense]);
//       setIsExpenseModalOpen(false);
//     }
//   };

//   /* ===========================
//      ACTIVE GROUP
//   =========================== */
//   const activeGroup = useMemo(
//     () => groups.find(g => g.id === activeGroupId) || null,
//     [groups, activeGroupId]
//   );

//   /* ===========================
//      UI STATES
//   =========================== */
//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Auth onDemoLogin={handleDemoLogin} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar
//         groups={groups}
//         activeGroupId={activeGroupId}
//         setActiveGroupId={setActiveGroupId}
//         onAddGroup={addGroup}
//         users={[currentUser]}
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />

//       <main className="flex-1 p-4 md:p-8">
//         {activeGroupId === null ? (
//           <Dashboard
//             expenses={expenses}
//             groups={groups}
//             users={[currentUser]}
//             currentUser={currentUser}
//           />
//         ) : (
//           <GroupDetail
//             group={activeGroup!}
//             expenses={expenses.filter(e => e.groupId === activeGroupId)}
//             users={[currentUser]}
//             currentUser={currentUser}
//             onAddExpense={() => setIsExpenseModalOpen(true)}
//           />
//         )}
//       </main>

//       {isExpenseModalOpen && activeGroup && (
//         <AddExpenseModal
//           isOpen={isExpenseModalOpen}
//           onClose={() => setIsExpenseModalOpen(false)}
//           group={activeGroup}
//           users={[currentUser]}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// };

// export default App;




// import React, { useState, useEffect, useMemo } from 'react';
// import { User, Group, Expense, SplitType } from './types';

// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import GroupDetail from './components/GroupDetail';
// import AddExpenseModal from './components/AddExpenseModal';
// import Auth from './components/Auth';

// import { categorizeExpense } from './services/geminiService';
// import { api } from './services/api';
// import { auth, onAuthStateChanged, signOut } from './firebase';

// /* ===========================
//    DEMO USERS (1 SAMPLE)
// =========================== */
// const DEMO_USERS: User[] = [
//   {
//     id: 'demo-user-999',
//     name: 'Sarah Jenkins',
//     email: 'sarah@example.com',
//     avatar: 'https://picsum.photos/seed/sarah/100'
//   },
//   // ( ...... )
// ];

// /* ===========================
//    DEMO DATA LOADER
// =========================== */
// const loadDemoData = (user: User) => {
//   const demoGroupId = 'demo-g1';
//   const now = Date.now();

//   const demoGroups: Group[] = [
//     {
//       id: demoGroupId,
//       name: 'Goa Summer Trip',
//       members: [user.id, DEMO_USERS[0].id],
//       createdAt: now - 86400000
//     },
//     // ( ...... )
//   ];

//   const demoExpenses: Expense[] = [
//     {
//       id: 'e1',
//       groupId: demoGroupId,
//       payerId: user.id,
//       description: 'Hotel Booking',
//       amount: 1200,
//       date: now - 2 * 86400000,
//       category: 'Travel',
//       splitType: SplitType.EQUAL,
//       splits: [
//         { userId: user.id, amount: 600 },
//         { userId: DEMO_USERS[0].id, amount: 600 }
//       ]
//     },
//     // ( ...... )
//   ];

//   return { demoGroups, demoExpenses };
// };

// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   /* ===========================
//      VIRTUAL USERS
//   =========================== */
//   const [virtualUsers, setVirtualUsers] = useState<User[]>([]);

//   const allKnownUsers = useMemo(() => {
//     const base = currentUser ? [currentUser, ...DEMO_USERS] : [...DEMO_USERS];
//     return [...base, ...virtualUsers];
//   }, [currentUser, virtualUsers]);

//   /* ===========================
//      AUTH LISTENER
//      → NORMAL USERS SEE DEMO DATA
//   =========================== */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const appUser: User = {
//           id: user.uid,
//           name: user.displayName || 'User',
//           email: user.email || '',
//           avatar: `https://picsum.photos/seed/${user.uid}/100`
//         };

//         setCurrentUser(appUser);

//         // ✅ LOAD DEMO DATA BY DEFAULT
//         const { demoGroups, demoExpenses } = loadDemoData(appUser);
//         setGroups(demoGroups);
//         setExpenses(demoExpenses);
//       } else {
//         setCurrentUser(null);
//       }
//       setIsAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* ===========================
//      DEMO LOGIN
//   =========================== */
//   const handleDemoLogin = (user: User) => {
//     setIsDemoMode(true);
//     setCurrentUser(user);

//     const { demoGroups, demoExpenses } = loadDemoData(user);
//     setGroups(demoGroups);
//     setExpenses(demoExpenses);
//     setIsAuthLoading(false);
//   };

//   /* ===========================
//      LOGOUT
//   =========================== */
//   const handleLogout = async () => {
//     if (isDemoMode) {
//       setIsDemoMode(false);
//       setCurrentUser(null);
//       setGroups([]);
//       setExpenses([]);
//       setVirtualUsers([]);
//       setActiveGroupId(null);
//     } else {
//       await signOut(auth);
//     }
//   };

//   /* ===========================
//      ADD GROUP
//   =========================== */
//   const addGroup = async (name: string, memberIds: string[]) => {
//     if (!currentUser) return;

//     const members = [...new Set([currentUser.id, ...memberIds])];

//     try {
//       const newGroup = await api.createGroup(name, members);
//       setGroups(prev => [...prev, newGroup]);
//     } catch {
//       setGroups(prev => [
//         ...prev,
//         { id: Math.random().toString(), name, members, createdAt: Date.now() }
//       ]);
//     }
//   };

//   /* ===========================
//      ADD MEMBER (KEY FIX)
//      → NAME / EMAIL / USER ID
//   =========================== */
//   const addMemberToGroup = (groupId: string, identifier: string) => {
//     if (!identifier.trim()) return;

//     const existingUser = allKnownUsers.find(
//       u =>
//         u.id === identifier ||
//         u.email.toLowerCase() === identifier.toLowerCase() ||
//         u.name.toLowerCase() === identifier.toLowerCase()
//     );

//     let memberId: string;

//     if (existingUser) {
//       memberId = existingUser.id;
//     } else {
//       const virtualId = `v-${Date.now()}`;
//       const virtualUser: User = {
//         id: virtualId,
//         name: identifier,
//         email: identifier.includes('@')
//           ? identifier
//           : `${identifier.toLowerCase().replace(/\s/g, '')}@guest.com`,
//         avatar: `https://picsum.photos/seed/${identifier}/100`
//       };
//       setVirtualUsers(prev => [...prev, virtualUser]);
//       memberId = virtualId;
//     }

//     setGroups(prev =>
//       prev.map(g => {
//         const gid = g.id || (g as any)._id;
//         if (gid === groupId) {
//           return {
//             ...g,
//             members: [...new Set([...g.members, memberId])]
//           };
//         }
//         return g;
//       })
//     );
//   };

//   /* ===========================
//      ADD EXPENSE
//   =========================== */
//   const addExpense = async (expenseData: Partial<Expense>) => {
//     if (!currentUser) return;

//     try {
//       const category =
//         expenseData.category ||
//         (await categorizeExpense(expenseData.description || ''));

//       const newExpense = await api.createExpense({
//         ...expenseData,
//         payerId: currentUser.id,
//         date: Date.now(),
//         category
//       });

//       setExpenses(prev => [...prev, newExpense]);
//       setIsExpenseModalOpen(false);
//     } catch {
//       setExpenses(prev => [
//         ...prev,
//         {
//           ...(expenseData as Expense),
//           id: Math.random().toString(),
//           payerId: expenseData.payerId || currentUser.id,
//           date: Date.now(),
//           category: expenseData.category || 'Other'
//         }
//       ]);
//       setIsExpenseModalOpen(false);
//     }
//   };

//   const activeGroup = useMemo(
//     () => groups.find(g => g.id === activeGroupId) || null,
//     [groups, activeGroupId]
//   );

//   /* ===========================
//      UI STATES
//   =========================== */
//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Auth onDemoLogin={handleDemoLogin} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar
//         groups={groups}
//         expenses={expenses}
//         activeGroupId={activeGroupId}
//         setActiveGroupId={setActiveGroupId}
//         onAddGroup={addGroup}
//         users={allKnownUsers}
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />

//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         {activeGroupId === null ? (
//           <Dashboard
//             expenses={expenses}
//             groups={groups}
//             users={allKnownUsers}
//             currentUser={currentUser}
//           />
//         ) : (
//           <GroupDetail
//             group={activeGroup!}
//             expenses={expenses.filter(e => e.groupId === activeGroupId)}
//             users={allKnownUsers}
//             currentUser={currentUser}
//             onAddExpense={() => setIsExpenseModalOpen(true)}
//             onAddMember={(input) => addMemberToGroup(activeGroupId!, input)}
//             onSettle={(e) => addExpense(e)}
//           />
//         )}
//       </main>

//       {isExpenseModalOpen && activeGroup && (
//         <AddExpenseModal
//           isOpen={isExpenseModalOpen}
//           onClose={() => setIsExpenseModalOpen(false)}
//           group={activeGroup}
//           users={allKnownUsers}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// };

// export default App;



// import React, { useState, useEffect, useMemo } from 'react';
// import { User, Group, Expense, SplitType } from './types';

// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import GroupDetail from './components/GroupDetail';
// import AddExpenseModal from './components/AddExpenseModal';
// import Auth from './components/Auth';

// import { categorizeExpense } from './services/geminiService';
// import { api } from './services/api';
// import { auth, onAuthStateChanged, signOut } from './firebase';

// /* ===========================
//    DEMO USERS (1 SAMPLE)
// =========================== */
// const DEMO_USERS: User[] = [
//   {
//     id: 'demo-user-999',
//     name: 'Sarah Jenkins',
//     email: 'sarah@example.com',
//     avatar: 'https://picsum.photos/seed/sarah/100'
//   },
//   // ( ...... )
// ];

// /* ===========================
//    DEMO DATA LOADER
// =========================== */
// const loadDemoData = (user: User) => {
//   const demoGroupId = 'demo-g1';
//   const now = Date.now();

//   const demoGroups: Group[] = [
//     {
//       id: demoGroupId,
//       name: 'Goa Summer Trip',
//       members: [user.id, DEMO_USERS[0].id],
//       createdAt: now - 86400000
//     },
//     // ( ...... )
//   ];

//   const demoExpenses: Expense[] = [
//     {
//       id: 'e1',
//       groupId: demoGroupId,
//       payerId: user.id,
//       description: 'Hotel Booking',
//       amount: 1200,
//       date: now - 2 * 86400000,
//       category: 'Travel',
//       splitType: SplitType.EQUAL,
//       splits: [
//         { userId: user.id, amount: 600 },
//         { userId: DEMO_USERS[0].id, amount: 600 }
//       ]
//     },
//     // ( ...... )
//   ];

//   return { demoGroups, demoExpenses };
// };

// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
//   const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);

//   /* ===========================
//      VIRTUAL USERS
//   =========================== */
//   const [virtualUsers, setVirtualUsers] = useState<User[]>([]);

//   const allKnownUsers = useMemo(() => {
//     const base = currentUser ? [currentUser, ...DEMO_USERS] : [...DEMO_USERS];
//     return [...base, ...virtualUsers];
//   }, [currentUser, virtualUsers]);

//   /* ===========================
//      AUTH LISTENER
//      → NORMAL USERS SEE DEMO DATA
//   =========================== */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const appUser: User = {
//           id: user.uid,
//           name: user.displayName || 'User',
//           email: user.email || '',
//           avatar: `https://picsum.photos/seed/${user.uid}/100`
//         };

//         setCurrentUser(appUser);

//         // ✅ Load demo data for ALL users
//         const { demoGroups, demoExpenses } = loadDemoData(appUser);
//         setGroups(demoGroups);
//         setExpenses(demoExpenses);
//       } else {
//         setCurrentUser(null);
//       }
//       setIsAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* ===========================
//      DEMO LOGIN
//   =========================== */
//   const handleDemoLogin = (user: User) => {
//     setIsDemoMode(true);
//     setCurrentUser(user);

//     const { demoGroups, demoExpenses } = loadDemoData(user);
//     setGroups(demoGroups);
//     setExpenses(demoExpenses);
//     setIsAuthLoading(false);
//   };

//   /* ===========================
//      LOGOUT
//   =========================== */
//   const handleLogout = async () => {
//     if (isDemoMode) {
//       setIsDemoMode(false);
//       setCurrentUser(null);
//       setGroups([]);
//       setExpenses([]);
//       setVirtualUsers([]);
//       setActiveGroupId(null);
//     } else {
//       await signOut(auth);
//     }
//   };

//   /* ===========================
//      ADD GROUP
//   =========================== */
//   const addGroup = async (name: string, memberIds: string[]) => {
//     if (!currentUser) return;

//     const members = [...new Set([currentUser.id, ...memberIds])];

//     try {
//       const newGroup = await api.createGroup(name, members);
//       setGroups(prev => [...prev, newGroup]);
//     } catch {
//       setGroups(prev => [
//         ...prev,
//         { id: Math.random().toString(), name, members, createdAt: Date.now() }
//       ]);
//     }
//   };

//   /* ===========================
//      ADD MEMBER
//      → NAME / EMAIL / USER ID
//   =========================== */
//   const addMemberToGroup = (groupId: string, identifier: string) => {
//     if (!identifier.trim()) return;

//     const existingUser = allKnownUsers.find(
//       u =>
//         u.id === identifier ||
//         u.email.toLowerCase() === identifier.toLowerCase() ||
//         u.name.toLowerCase() === identifier.toLowerCase()
//     );

//     let memberId: string;

//     if (existingUser) {
//       memberId = existingUser.id;
//     } else {
//       const virtualId = `v-${Date.now()}`;
//       const virtualUser: User = {
//         id: virtualId,
//         name: identifier,
//         email: identifier.includes('@')
//           ? identifier
//           : `${identifier.toLowerCase().replace(/\s/g, '')}@guest.com`,
//         avatar: `https://picsum.photos/seed/${identifier}/100`
//       };
//       setVirtualUsers(prev => [...prev, virtualUser]);
//       memberId = virtualId;
//     }

//     setGroups(prev =>
//       prev.map(g =>
//         g.id === groupId
//           ? { ...g, members: [...new Set([...g.members, memberId])] }
//           : g
//       )
//     );
//   };

//   /* ===========================
//      ADD EXPENSE (FIXED)
//      ✔ Uses selected payerId
//   =========================== */
//   const addExpense = async (expenseData: Partial<Expense>) => {
//     if (!currentUser) return;

//     try {
//       const category =
//         expenseData.category ||
//         (await categorizeExpense(expenseData.description || ''));

//       const newExpense = await api.createExpense({
//         ...expenseData,
//         payerId: expenseData.payerId || currentUser.id, // ✅ FIX
//         date: Date.now(),
//         category
//       });

//       setExpenses(prev => [...prev, newExpense]);
//       setIsExpenseModalOpen(false);
//     } catch {
//       setExpenses(prev => [
//         ...prev,
//         {
//           ...(expenseData as Expense),
//           id: Math.random().toString(),
//           payerId: expenseData.payerId || currentUser.id, // ✅ FIX
//           date: Date.now(),
//           category: expenseData.category || 'Other'
//         }
//       ]);
//       setIsExpenseModalOpen(false);
//     }
//   };

//   const activeGroup = useMemo(
//     () => groups.find(g => g.id === activeGroupId) || null,
//     [groups, activeGroupId]
//   );

//   /* ===========================
//      UI STATES
//   =========================== */
//   if (isAuthLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Auth onDemoLogin={handleDemoLogin} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar
//         groups={groups}
//         expenses={expenses}
//         activeGroupId={activeGroupId}
//         setActiveGroupId={setActiveGroupId}
//         onAddGroup={addGroup}
//         users={allKnownUsers}
//         currentUser={currentUser}
//         onLogout={handleLogout}
//       />

//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         {activeGroupId === null ? (
//           <Dashboard
//             expenses={expenses}
//             groups={groups}
//             users={allKnownUsers}
//             currentUser={currentUser}
//           />
//         ) : (
//           <GroupDetail
//             group={activeGroup!}
//             expenses={expenses.filter(e => e.groupId === activeGroupId)}
//             users={allKnownUsers}
//             currentUser={currentUser}
//             onAddExpense={() => setIsExpenseModalOpen(true)}
//             onAddMember={(input) => addMemberToGroup(activeGroupId!, input)}
//             onSettle={(e) => addExpense(e)}
//           />
//         )}
//       </main>

//       {isExpenseModalOpen && activeGroup && (
//         <AddExpenseModal
//           isOpen={isExpenseModalOpen}
//           onClose={() => setIsExpenseModalOpen(false)}
//           group={activeGroup}
//           users={allKnownUsers}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect, useMemo } from 'react';
import { User, Group, Expense, SplitType } from './types';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GroupDetail from './components/GroupDetail';
import AddExpenseModal from './components/AddExpenseModal';
import Auth from './components/Auth';

import { categorizeExpense } from './services/geminiService';
import { api } from './services/api';
import { auth, onAuthStateChanged, signOut } from './firebase';

/* ===========================
   CATEGORY NORMALIZATION
=========================== */
const CATEGORY_MAP: Record<string, string> = {
  food: 'Food',
  travel: 'Travel',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  health: 'Health',
  settlement: 'Settlement',
  other: 'Other'
};

const normalizeCategory = (category?: string) => {
  if (!category) return 'Other';
  const key = category.toLowerCase().trim();
  return CATEGORY_MAP[key] || 'Other';
};

/* ===========================
   DEMO USERS (1 SAMPLE)
=========================== */
const DEMO_USERS: User[] = [
  {
    id: 'demo-user-999',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatar: 'https://picsum.photos/seed/sarah/100'
  }
  // ( ...... )
];

/* ===========================
   DEMO DATA LOADER
=========================== */
const loadDemoData = (user: User) => {
  const demoGroupId = 'demo-g1';
  const now = Date.now();

  const demoGroups: Group[] = [
    {
      id: demoGroupId,
      name: 'Goa Summer Trip',
      members: [user.id, DEMO_USERS[0].id],
      createdAt: now - 86400000
    }
    // ( ...... )
  ];

  const demoExpenses: Expense[] = [
    {
      id: 'e1',
      groupId: demoGroupId,
      payerId: user.id,
      description: 'Hotel Booking',
      amount: 1200,
      date: now - 2 * 86400000,
      category: 'Travel',
      splitType: SplitType.EQUAL,
      splits: [
        { userId: user.id, amount: 600 },
        { userId: DEMO_USERS[0].id, amount: 600 }
      ]
    }
    // ( ...... )
  ];

  return { demoGroups, demoExpenses };
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  /* ===========================
     VIRTUAL USERS (ADD BY NAME)
  =========================== */
  const [virtualUsers, setVirtualUsers] = useState<User[]>([]);

  const allKnownUsers = useMemo(() => {
    const base = currentUser ? [currentUser, ...DEMO_USERS] : [...DEMO_USERS];
    return [...base, ...virtualUsers];
  }, [currentUser, virtualUsers]);

  /* ===========================
     AUTH LISTENER
     → EVERY USER GETS DEMO DATA
  =========================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const appUser: User = {
          id: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          avatar: `https://picsum.photos/seed/${user.uid}/100`
        };

        setCurrentUser(appUser);

        const { demoGroups, demoExpenses } = loadDemoData(appUser);
        setGroups(demoGroups);
        setExpenses(demoExpenses);
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ===========================
     DEMO LOGIN
  =========================== */
  const handleDemoLogin = (user: User) => {
    setIsDemoMode(true);
    setCurrentUser(user);

    const { demoGroups, demoExpenses } = loadDemoData(user);
    setGroups(demoGroups);
    setExpenses(demoExpenses);
    setIsAuthLoading(false);
  };

  /* ===========================
     LOGOUT
  =========================== */
  const handleLogout = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setCurrentUser(null);
      setGroups([]);
      setExpenses([]);
      setVirtualUsers([]);
      setActiveGroupId(null);
    } else {
      await signOut(auth);
    }
  };

  /* ===========================
     ADD GROUP
  =========================== */
  const addGroup = async (name: string, memberIds: string[]) => {
    if (!currentUser) return;

    const members = [...new Set([currentUser.id, ...memberIds])];

    try {
      const newGroup = await api.createGroup(name, members);
      setGroups(prev => [...prev, newGroup]);
    } catch {
      setGroups(prev => [
        ...prev,
        { id: Math.random().toString(), name, members, createdAt: Date.now() }
      ]);
    }
  };

  /* ===========================
     ADD MEMBER (NAME / EMAIL / ID)
  =========================== */
  const addMemberToGroup = (groupId: string, identifier: string) => {
    if (!identifier.trim()) return;

    const existingUser = allKnownUsers.find(
      u =>
        u.id === identifier ||
        u.email.toLowerCase() === identifier.toLowerCase() ||
        u.name.toLowerCase() === identifier.toLowerCase()
    );

    let memberId: string;

    if (existingUser) {
      memberId = existingUser.id;
    } else {
      const virtualId = `v-${Date.now()}`;
      const virtualUser: User = {
        id: virtualId,
        name: identifier,
        email: identifier.includes('@')
          ? identifier
          : `${identifier.toLowerCase().replace(/\s/g, '')}@guest.com`,
        avatar: `https://picsum.photos/seed/${identifier}/100`
      };
      setVirtualUsers(prev => [...prev, virtualUser]);
      memberId = virtualId;
    }

    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, members: [...new Set([...g.members, memberId])] }
          : g
      )
    );
  };

  /* ===========================
     ADD EXPENSE (FINAL FIX)
  =========================== */
  const addExpense = async (expenseData: Partial<Expense>) => {
    if (!currentUser) return;

    try {
      let finalCategory = expenseData.category;

      if (!finalCategory) {
        const aiCategory = await categorizeExpense(
          expenseData.description || ''
        );
        finalCategory = normalizeCategory(aiCategory);
      } else {
        finalCategory = normalizeCategory(finalCategory);
      }

      const newExpense = await api.createExpense({
        ...expenseData,
        payerId: expenseData.payerId || currentUser.id,
        date: Date.now(),
        category: finalCategory
      });

      setExpenses(prev => [...prev, newExpense]);
      setIsExpenseModalOpen(false);
    } catch {
      setExpenses(prev => [
        ...prev,
        {
          ...(expenseData as Expense),
          id: Math.random().toString(),
          payerId: expenseData.payerId || currentUser.id,
          date: Date.now(),
          category: normalizeCategory(expenseData.category)
        }
      ]);
      setIsExpenseModalOpen(false);
    }
  };

  const activeGroup = useMemo(
    () => groups.find(g => g.id === activeGroupId) || null,
    [groups, activeGroupId]
  );

  /* ===========================
     UI STATES
  =========================== */
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onDemoLogin={handleDemoLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        groups={groups}
        expenses={expenses}
        activeGroupId={activeGroupId}
        setActiveGroupId={setActiveGroupId}
        onAddGroup={addGroup}
        users={allKnownUsers}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeGroupId === null ? (
          <Dashboard
            expenses={expenses}
            groups={groups}
            users={allKnownUsers}
            currentUser={currentUser}
          />
        ) : (
          <GroupDetail
            group={activeGroup!}
            expenses={expenses.filter(e => e.groupId === activeGroupId)}
            users={allKnownUsers}
            currentUser={currentUser}
            onAddExpense={() => setIsExpenseModalOpen(true)}
            onAddMember={(input) => addMemberToGroup(activeGroupId!, input)}
            onSettle={(e) => addExpense(e)}
          />
        )}
      </main>

      {isExpenseModalOpen && activeGroup && (
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          group={activeGroup}
          users={allKnownUsers}
          onSubmit={addExpense}
        />
      )}
    </div>
  );
};

export default App;
