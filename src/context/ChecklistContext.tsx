import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Checklist, Task, Priority } from '../types';
import { loadChecklists, saveChecklists, loadHardMode, saveHardMode } from '../utils/storage';

export interface ChecklistContextType {
  checklists: Checklist[];
  hardMode: boolean;
  createChecklist: (title: string, description: string) => void;
  updateChecklist: (id: string, title: string, description: string) => void;
  deleteChecklist: (id: string) => void;
  createTask: (checklistId: string, title: string, description: string, deadline: string, priority: Priority) => void;
  updateTask: (checklistId: string, taskId: string, title: string, description: string, deadline: string, priority: Priority) => void;
  toggleTask: (checklistId: string, taskId: string) => void;
  deleteTask: (checklistId: string, taskId: string) => void;
  toggleHardMode: () => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

interface ChecklistProviderProps {
  children: ReactNode;
}

export const ChecklistProvider = ({ children }: ChecklistProviderProps) => {
  const [checklists, setChecklists] = useState<Checklist[]>(() => loadChecklists());
  const [hardMode, setHardMode] = useState<boolean>(() => loadHardMode());

  useEffect(() => {
    saveChecklists(checklists);
  }, [checklists]);

  useEffect(() => {
    saveHardMode(hardMode);
  }, [hardMode]);

  const toggleHardMode = useCallback(() => {
    setHardMode((prev) => !prev);
  }, []);

  const createChecklist = (title: string, description: string) => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title,
      description: description || undefined,
      tasks: [],
    };
    setChecklists((prev) => [...prev, newChecklist]);
  };

  const updateChecklist = (id: string, title: string, description: string) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === id
          ? { ...cl, title, description: description || undefined }
          : cl
      )
    );
  };

  const deleteChecklist = (id: string) => {
    setChecklists((prev) => prev.filter((cl) => cl.id !== id));
  };

  const createTask = (
    checklistId: string,
    title: string,
    description: string,
    deadline: string,
    priority: Priority
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      deadline,
      priority,
      completed: false,
    };
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId ? { ...cl, tasks: [...cl.tasks, newTask] } : cl
      )
    );
  };

  const updateTask = (
    checklistId: string,
    taskId: string,
    title: string,
    description: string,
    deadline: string,
    priority: Priority
  ) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              tasks: cl.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, title, description, deadline, priority }
                  : t
              ),
            }
          : cl
      )
    );
  };

  const toggleTask = (checklistId: string, taskId: string) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              tasks: cl.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : cl
      )
    );
  };

  const deleteTask = (checklistId: string, taskId: string) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? { ...cl, tasks: cl.tasks.filter((t) => t.id !== taskId) }
          : cl
      )
    );
  };

  const value: ChecklistContextType = {
    checklists,
    hardMode,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    toggleHardMode,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
};

export { ChecklistContext };
