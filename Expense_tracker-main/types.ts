
// export enum SplitType {
//   EQUAL = 'EQUAL',
//   EXACT = 'EXACT',
//   PERCENTAGE = 'PERCENTAGE'
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

// export interface Group {
//   id: string;
//   name: string;
//   members: string[]; // User IDs
//   createdAt: number;
// }

// export interface ExpenseSplit {
//   userId: string;
//   amount: number;
//   percentage?: number;
// }

// export interface Expense {
//   id: string;
//   groupId: string;
//   payerId: string;
//   description: string;
//   amount: number;
//   date: number;
//   splitType: SplitType;
//   splits: ExpenseSplit[];
//   category?: string;
// }

// export interface Balance {
//   fromUserId: string;
//   toUserId: string;
//   amount: number;
// }

// export interface AppState {
//   users: User[];
//   groups: Group[];
//   expenses: Expense[];
//   currentUser: User | null;
// }





export enum SplitType {
  EQUAL = 'EQUAL',
  EXACT = 'EXACT',
  PERCENTAGE = 'PERCENTAGE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // User IDs
  createdAt: number;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  payerId: string;
  description: string;
  amount: number;
  date: number;
  splitType: SplitType;
  splits: ExpenseSplit[];
  category?: string;
}

export interface Balance {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export interface AppState {
  users: User[];
  groups: Group[];
  expenses: Expense[];
  currentUser: User | null;
}
