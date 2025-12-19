
import { Group, Expense, User } from '../types';

const API_BASE_URL = '/api';

export const api = {
  async getGroups(): Promise<Group[]> {
    const res = await fetch(`${API_BASE_URL}/groups`);
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
  },

  async createGroup(name: string, members: string[]): Promise<Group> {
    const res = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, members }),
    });
    return res.json();
  },

  async getExpenses(): Promise<Expense[]> {
    const res = await fetch(`${API_BASE_URL}/expenses`);
    return res.json();
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return res.json();
  }
};
