import { Box, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../button';

interface CreateBucketButtonProps {
  onCreateBucket: (name: string) => void;
}

export function CreateBucketButton({ onCreateBucket }: CreateBucketButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [bucketName, setBucketName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (bucketName.trim()) {
      onCreateBucket(bucketName);
    }
    setIsEditing(false);
    setBucketName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && bucketName.trim()) {
      onCreateBucket(bucketName);
      setIsEditing(false);
      setBucketName('');
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setBucketName('');
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ width: '100%', minWidth: 280 }}>
        <TextField
          inputRef={textFieldRef}
          fullWidth
          size="small"
          value={bucketName}
          onChange={e => setBucketName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter bucket name..."
          autoFocus
          sx={{ mt: 6 }}
        />
      </Box>
    );
  }

  return (
    <Button
      buttonText="Add Bucket"
      onClick={() => setIsEditing(true)}
      size="small"
      sx={{ width: '100%', minWidth: 280, mt: 8 }}
    />
  );
}
