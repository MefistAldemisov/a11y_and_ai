import { useState } from 'react';
import { Modal, TextInput, TextArea, Button, Text } from '@gravity-ui/uikit';
import type { Checklist } from '../../types';
import './ChecklistModal.css';

interface ChecklistModalProps {
  open: boolean;
  checklist?: Checklist;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
}

function ChecklistModalContent({ checklist, onClose, onSave }: Omit<ChecklistModalProps, 'open'>) {
  const [title, setTitle] = useState(checklist?.title || '');
  const [description, setDescription] = useState(checklist?.description || '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});

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

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    // Validate all fields
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);

    setTouched({ title: true, description: true });
    setErrors({
      title: titleError,
      description: descriptionError,
    });

    // Only save if there are no errors
    if (!titleError && !descriptionError) {
      onSave(title.trim(), description.trim());
      onClose();
    }
  };

  const isFormValid = !validateTitle(title) && !validateDescription(description);

  return (
    <div className="checklist-modal__form">
      <div>
        <Text variant="body-2" className="checklist-modal__label">
          Title <span style={{ color: 'var(--g-color-text-danger)' }}>*</span>
        </Text>
        <TextInput
          value={title}
          onUpdate={handleTitleChange}
          onBlur={handleTitleBlur}
          placeholder="Enter checklist title"
          size="l"
          autoFocus
          validationState={touched.title && errors.title ? 'invalid' : undefined}
          errorMessage={touched.title ? errors.title : undefined}
        />
      </div>
      <div>
        <Text variant="body-2" className="checklist-modal__label">Description (optional)</Text>
        <TextArea
          value={description}
          onUpdate={handleDescriptionChange}
          onBlur={handleDescriptionBlur}
          placeholder="Enter checklist description"
          rows={3}
          size="l"
          validationState={touched.description && errors.description ? 'invalid' : undefined}
          errorMessage={touched.description ? errors.description : undefined}
        />
      </div>
      <div className="checklist-modal__actions">
        <Button view="flat" size="l" onClick={handleClose}>
          Cancel
        </Button>
        <Button view="action" size="l" onClick={handleSave} disabled={!isFormValid}>
          {checklist ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
}

export const ChecklistModal = ({ open, checklist, onClose, onSave }: ChecklistModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {open && (
        <ChecklistModalContent
          key={checklist?.id || 'new'}
          checklist={checklist}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
};
