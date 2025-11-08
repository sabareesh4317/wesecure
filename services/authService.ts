
import type { User } from '../types';

const USERS_KEY = 'wesecure_users';
const SESSION_KEY = 'wesecure_session';

// Helper to get users from localStorage
const getUsers = (): Record<string, string> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    return {};
  }
};

// Helper to save users to localStorage
const saveUsers = (users: Record<string, string>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (email: string, password: string):User => {
  const users = getUsers();
  if (users[email]) {
    throw new Error('User with this email already exists.');
  }
  users[email] = password; // In a real app, hash the password!
  saveUsers(users);
  return { email };
};

export const login = (email: string, password: string): User => {
  const users = getUsers();
  if (!users[email] || users[email] !== password) {
    throw new Error('Invalid email or password.');
  }
  const user = { email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
};