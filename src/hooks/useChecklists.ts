import { useContext } from 'react';
import { ChecklistContext, type ChecklistContextType } from '../context/ChecklistContext';

export const useChecklists = (): ChecklistContextType => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklists must be used within ChecklistProvider');
  }
  return context;
};
