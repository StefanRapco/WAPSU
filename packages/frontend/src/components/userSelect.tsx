import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Checkbox,
  InputAdornment,
  Typography as MuiTypography,
  Stack,
  TextField
} from '@mui/material';
import { Form, Formik } from 'formik';
import { ReactNode, useState } from 'react';
import * as yup from 'yup';
import { useUserMany } from '../hooks/useUserMany';
import { Button } from './button';
import { getInitials } from './navigation/accountMenu';
import { CircularAvatar } from './navigation/circularAvatar';

interface UserSelectProps {
  readonly onSubmit: (selectedUserIds: string[]) => void;
}

export function UserSelect({ onSubmit }: UserSelectProps): ReactNode {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterTerm, setFilterTerm] = useState<string>('');

  const { data: filteredUsers } = useUserMany({ term: filterTerm });

  const validationSchema = yup.object({
    users: yup.array().of(yup.string()).min(1, 'Please select at least one user')
  });

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Formik
      initialValues={{ users: [] }}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async () => {
        onSubmit(selectedUsers);
        setSelectedUsers([]);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Stack spacing={2} sx={{ pl: 8, pr: 8 }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={filterTerm}
              onChange={e => setFilterTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
            <Box sx={{ mt: 3 }}>
              {filteredUsers?.items.map(user => (
                <Box
                  key={user.id}
                  sx={{
                    mb: 3,
                    mt: 3,
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => {
                      handleUserToggle(user.id);
                      setFieldValue(
                        'users',
                        selectedUsers.includes(user.id)
                          ? selectedUsers.filter(id => id !== user.id)
                          : [...selectedUsers, user.id]
                      );
                    }}
                  />
                  <CircularAvatar size="s">{getInitials(user.fullName)}</CircularAvatar>
                  <Box sx={{ ml: 5 }}>
                    <MuiTypography variant="body1">{user.fullName}</MuiTypography>
                    <MuiTypography variant="body2" color="text.secondary">
                      {user.email}
                    </MuiTypography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>

          <Box sx={{ pl: 8, pr: 8, mt: 3 }}>
            <Button
              type="submit"
              disabled={isSubmitting || selectedUsers.length === 0}
              buttonText="Add Selected Users"
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
}
