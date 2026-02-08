import type { Checklist } from '../types';
import { STORAGE_KEY } from '../constants';

export const loadChecklists = (): Checklist[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading checklists:', error);
    return [];
  }
};

export const saveChecklists = (checklists: Checklist[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
  } catch (error) {
    console.error('Error saving checklists:', error);
  }
};
