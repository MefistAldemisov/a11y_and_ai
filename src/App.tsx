import { ThemeProvider, Button, Icon, Text, Switch } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';
import type { Checklist, Task } from './types';
import { ChecklistCard } from './components/ChecklistCard';
import { ChecklistModal } from './components/ChecklistModal';
import { TaskModal } from './components/TaskModal';
import { useChecklists } from './hooks/useChecklists';
import { useModal } from './hooks/useModal';
import './App.css';

function App() {
  const {
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
  } = useChecklists();

  const checklistModal = useModal<Checklist>();
  const taskModal = useModal<{ checklistId: string; task?: Task }>();

  const handleSaveChecklist = (title: string, description: string) => {
    if (checklistModal.data) {
      updateChecklist(checklistModal.data.id, title, description);
    } else {
      createChecklist(title, description);
    }
  };

  const handleSaveTask = (
    title: string,
    description: string,
    deadline: string,
    priority: 'low' | 'medium' | 'critical'
  ) => {
    if (!taskModal.data) return;

    if (taskModal.data.task) {
      updateTask(
        taskModal.data.checklistId,
        taskModal.data.task.id,
        title,
        description,
        deadline,
        priority
      );
    } else {
      createTask(taskModal.data.checklistId, title, description, deadline, priority);
    }
  };

  const handleAddTask = (checklistId: string) => {
    taskModal.open({ checklistId });
  };

  const handleEditTask = (checklistId: string, task: Task) => {
    taskModal.open({ checklistId, task });
  };

  return (
    <ThemeProvider theme="light">
      <div className="app">
        <div className="app__header">
          <Text variant="display-2">Task Lists</Text>
          <div className="app__header-controls">
            <div className="app__hard-mode-toggle">
              <Switch
                checked={hardMode}
                onUpdate={toggleHardMode}
                size="l"
              />
              <Text variant="body-2">Hard Mode</Text>
            </div>
            <Button view="action" size="l" onClick={() => checklistModal.open()}>
              <Icon data={Plus} size={18} />
              New Checklist
            </Button>
          </div>
        </div>

        <div className="app__content">
          {checklists.length === 0 ? (
            <div className="app__empty">
              <Text variant="body-2" color="secondary">
                No checklists yet. Create your first checklist to get started!
              </Text>
            </div>
          ) : (
            checklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onAddTask={handleAddTask}
                onEditChecklist={checklistModal.open}
                onDeleteChecklist={deleteChecklist}
                onToggleTask={toggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
              />
            ))
          )}
        </div>

        <ChecklistModal
          open={checklistModal.isOpen}
          checklist={checklistModal.data}
          onClose={checklistModal.close}
          onSave={handleSaveChecklist}
        />

        <TaskModal
          open={taskModal.isOpen}
          task={taskModal.data?.task}
          onClose={taskModal.close}
          onSave={handleSaveTask}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
