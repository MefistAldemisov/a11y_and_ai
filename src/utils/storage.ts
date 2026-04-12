import type { Checklist } from '../types';
import { STORAGE_KEY, HARD_MODE_STORAGE_KEY } from '../constants';

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

export const loadHardMode = (): boolean => {
  try {
    const data = localStorage.getItem(HARD_MODE_STORAGE_KEY);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('Error loading hard mode setting:', error);
    return false;
  }
};

export const saveHardMode = (enabled: boolean): void => {
  try {
    localStorage.setItem(HARD_MODE_STORAGE_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error('Error saving hard mode setting:', error);
  }
};
