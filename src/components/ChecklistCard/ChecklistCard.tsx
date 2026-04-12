import { useState } from 'react';
import { Card, Text, Button, Icon, Progress } from '@gravity-ui/uikit';
import { Plus, Pencil, TrashBin, ChevronDown, ChevronUp } from '@gravity-ui/icons';
import type { Checklist, Task } from '../../types';
import { TaskItem } from '../TaskItem';
import './ChecklistCard.css';

interface ChecklistCardProps {
  checklist: Checklist;
  onAddTask: (checklistId: string) => void;
  onEditChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (checklistId: string) => void;
  onToggleTask: (checklistId: string, taskId: string) => void;
  onEditTask: (checklistId: string, task: Task) => void;
  onDeleteTask: (checklistId: string, taskId: string) => void;
}

export const ChecklistCard = ({
  checklist,
  onAddTask,
  onEditChecklist,
  onDeleteChecklist,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: ChecklistCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedTasks = checklist.tasks.filter((task) => task.completed).length;
  const totalTasks = checklist.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="checklist-card">
      <div className="checklist-card__header">
        <div className="checklist-card__header-row">
          <button
            className="checklist-card__expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={`${checklist.title}. ${isExpanded ? 'Свернуть чеклист' : 'Развернуть чеклист'}`}
          >
            <Icon data={isExpanded ? ChevronUp : ChevronDown} size={20} />
            <span className="checklist-card__title-text">
              {checklist.title}
            </span>
          </button>
          <div className="checklist-card__actions">
            <Button
              view="action"
              size="m"
              onClick={() => onAddTask(checklist.id)}
              aria-label="Добавить задачу"
            >
              <Icon data={Plus} size={16} />
            </Button>
            <Button
              view="outlined"
              size="m"
              onClick={() => onEditChecklist(checklist)}
              aria-label="Редактировать чеклист"
            >
              <Icon data={Pencil} size={16} />
            </Button>
            <Button
              view="outlined"
              size="m"
              onClick={() => onDeleteChecklist(checklist.id)}
              aria-label="Удалить чеклист"
            >
              <Icon data={TrashBin} size={16} />
            </Button>
          </div>
        </div>
        {checklist.description && (
          <Text variant="body-1" color="secondary" className="checklist-card__description">
            {checklist.description}
          </Text>
        )}
        {totalTasks > 0 && (
          <div className="checklist-card__progress">
            <div className="checklist-card__progress-info">
              <Text variant="caption-2" color="secondary">
                Progress
              </Text>
              <Text variant="caption-2" color="secondary">
                {completedTasks} / {totalTasks}
              </Text>
            </div>
            <Progress value={progress} size="s" theme="success" className="checklist-card__progress-bar" />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="checklist-card__tasks">
          {checklist.tasks.length === 0 ? (
            <Text variant="body-1" color="secondary" className="checklist-card__empty">
              No tasks yet. Add your first task!
            </Text>
          ) : (
            checklist.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(taskId) => onToggleTask(checklist.id, taskId)}
                onEdit={(task) => onEditTask(checklist.id, task)}
                onDelete={(taskId) => onDeleteTask(checklist.id, taskId)}
              />
            ))
          )}
        </div>
      )}
    </Card>
  );
};
