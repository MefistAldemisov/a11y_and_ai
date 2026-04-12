import { useState } from 'react';
import { Modal, TextInput, TextArea, Button, Select, Text } from '@gravity-ui/uikit';
import type { Task, Priority } from '../../types';
import { PRIORITY_OPTIONS, DEFAULT_PRIORITY } from '../../constants';
import taskFieldsConfig from '../../config/taskFieldsConfig.json';
import './TaskModal.css';

const isFieldVisible = (fieldName: string): boolean =>
  taskFieldsConfig.fields.find((f) => f.name === fieldName)?.visible ?? true;

interface TaskModalProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (title: string, description: string, deadline: string, priority: Priority) => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  deadline?: string;
}

function TaskModalContent({ task, onClose, onSave }: Omit<TaskModalProps, 'open'>) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || DEFAULT_PRIORITY);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean; deadline?: boolean }>({});

  const validateTitle = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Title is required';
    }
    if (value.trim().length < 3) {
      return 'Title must be at least 3 characters long';
    }
    if (value.trim().length > 100) {
      return 'Title must not exceed 100 characters';
    }
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (value.trim().length > 500) {
      return 'Description must not exceed 500 characters';
    }
    return undefined;
  };

  const validateDeadline = (value: string): string | undefined => {
    // Deadline is optional, only validate if provided
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Deadline cannot be in the past';
      }
    }
    return undefined;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (touched.title) {
      const error = validateTitle(value);
      setErrors(prev => ({ ...prev, title: error }));
    }
  };

  const handleTitleBlur = () => {
    setTouched(prev => ({ ...prev, title: true }));
    const error = validateTitle(title);
    setErrors(prev => ({ ...prev, title: error }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (touched.description) {
      const error = validateDescription(value);
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  const handleDescriptionBlur = () => {
    setTouched(prev => ({ ...prev, description: true }));
    const error = validateDescription(description);
    setErrors(prev => ({ ...prev, description: error }));
  };

  const handleDeadlineChange = (value: string) => {
    setDeadline(value);
    if (touched.deadline) {
      const error = validateDeadline(value);
      setErrors(prev => ({ ...prev, deadline: error }));
    }
  };

  const handleDeadlineBlur = () => {
    setTouched(prev => ({ ...prev, deadline: true }));
    const error = validateDeadline(deadline);
    setErrors(prev => ({ ...prev, deadline: error }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    // Validate all fields
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    const deadlineError = validateDeadline(deadline);

    setTouched({ title: true, description: true, deadline: true });
    setErrors({
      title: titleError,
      description: descriptionError,
      deadline: deadlineError,
    });

    // Only save if there are no errors
    if (!titleError && !descriptionError && !deadlineError) {
      onSave(title.trim(), description.trim(), deadline, priority);
      onClose();
    }
  };

  const isFormValid = !validateTitle(title) && !validateDescription(description) && !validateDeadline(deadline);

  return (
    <div className="task-modal__form">
      <h2 id="task-modal-title" className="task-modal__title">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      {isFieldVisible('title') && (
        <div>
          <Text variant="body-2" className="task-modal__label">
            Title <span style={{ color: 'var(--g-color-text-danger)' }}>*</span>
          </Text>
          <TextInput
            value={title}
            onUpdate={handleTitleChange}
            onBlur={handleTitleBlur}
            placeholder="Enter task title"
            size="l"
            autoFocus
            validationState={touched.title && errors.title ? 'invalid' : undefined}
            errorMessage={touched.title ? errors.title : undefined}
          />
        </div>
      )}
      {isFieldVisible('description') && (
        <div>
          <Text variant="body-2" className="task-modal__label">Description</Text>
          <TextArea
            value={description}
            onUpdate={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            placeholder="Enter task description"
            rows={3}
            size="l"
            validationState={touched.description && errors.description ? 'invalid' : undefined}
            errorMessage={touched.description ? errors.description : undefined}
          />
        </div>
      )}
      <div className="task-modal__row">
        {isFieldVisible('deadline') && (
          <div>
            <Text variant="body-2" className="task-modal__label">
              Deadline (optional)
            </Text>
            <input
              type="date"
              value={deadline}
              onChange={(e) => handleDeadlineChange(e.target.value)}
              onBlur={handleDeadlineBlur}
              className="task-modal__date-input"
              required
              aria-invalid={touched.deadline && errors.deadline ? 'true' : 'false'}
              aria-describedby={touched.deadline && errors.deadline ? 'deadline-error' : undefined}
            />
            {touched.deadline && errors.deadline && (
              <Text
                id="deadline-error"
                variant="caption-2"
                color="danger"
                aria-live="assertive"
                style={{ marginTop: '4px', display: 'block' }}
              >
                {errors.deadline}
              </Text>
            )}
          </div>
        )}
        {isFieldVisible('priority') && (
          <div>
            <Text variant="body-2" className="task-modal__label">Priority</Text>
            <Select
              value={[priority]}
              onUpdate={(values) => setPriority(values[0] as Priority)}
              options={PRIORITY_OPTIONS}
              size="l"
            />
          </div>
        )}
      </div>
      <div className="task-modal__actions">
        <Button view="flat" size="l" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          view="action"
          size="l"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          {task ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
}

export const TaskModal = ({ open, task, onClose, onSave }: TaskModalProps) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="task-modal-title">
      {open && (
        <TaskModalContent
          key={task?.id || 'new'}
          task={task}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
};
