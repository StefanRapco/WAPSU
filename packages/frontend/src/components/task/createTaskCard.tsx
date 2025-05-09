import { Box, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { TaskCard } from '../taskCard';

interface CreateTaskCardProps {
  onCreateTask: (name: string) => void;
  onCancel: () => void;
}

export function CreateTaskCard({ onCreateTask, onCancel }: CreateTaskCardProps) {
  const [taskName, setTaskName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  const handleBlur = () => {
    if (taskName.trim()) {
      onCreateTask(taskName);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && taskName.trim()) {
      onCreateTask(taskName);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TaskCard
        task={{
          id: 'new',
          name: taskName,
          notes: '',
          createdAt: new Date().toISOString(),
          sortOrder: 0,
          progress: { label: 'Not Started', value: 'notStarted' },
          priority: { label: 'Medium', value: 'medium' },
          assignees: [],
          comments: [],
          checklist: [],
          bucket: {
            id: '',
            name: '',
            sortOrder: 0,
            tasks: []
          }
        }}
        isEditing
        onEdit={() => {}}
        onDelete={() => {}}
        onChecklistItemToggle={() => {}}
        customContent={
          <TextField
            inputRef={textFieldRef}
            fullWidth
            size="small"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Enter task name..."
            autoFocus
            sx={{
              display: 'flex',
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': { borderColor: 'black' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: 'black' }
              },
              '& .MuiInputLabel-root': {
                color: 'black'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black'
              }
            }}
          />
        }
      />
    </Box>
  );
}
