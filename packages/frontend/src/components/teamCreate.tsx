import { useMutation } from '@apollo/client';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { gql } from '../gql-generated/gql';
import { TeamAvatar, teamAvatarsArray } from '../images/images';
import { Button } from './button';
import { Drawer } from './drawer';
import { TextField } from './textField';
import { UserSelect } from './userSelect';

interface TeamFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onError: () => void;
}

const validationSchema = yup.object({
  title: yup.string().required('Team name is required')
});

export function TeamCreate({ open, onClose, onSubmit, onError }: TeamFormProps) {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState<TeamAvatar>(teamAvatarsArray[0]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [createTeam, { loading }] = useMutation(mutation, {
    onCompleted: values => {
      onSubmit();
      navigate(`/teams/${values.teamCreate.id}`);
    },
    onError: () => onError()
  });

  return (
    <Drawer open={open} onClose={onClose} title="Create New Team">
      <Box sx={{ p: 3 }}>
        <Formik
          initialValues={{ title: '' }}
          validationSchema={validationSchema}
          onSubmit={async values =>
            createTeam({
              variables: {
                input: { name: values.title, avatar: selectedAvatar.id, userIds: selectedUsers }
              }
            })
          }
        >
          {({ values, errors, touched }) => (
            <Form>
              <Stack spacing={2} ml={5} mr={5}>
                <TextField
                  label="Team Name"
                  name="title"
                  placeholder="Team Name"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title != null}
                />

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Select Team Avatar
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {teamAvatarsArray.map(avatar => (
                    <Grid item key={avatar.id}>
                      <Box
                        component="img"
                        src={avatar.src}
                        alt={avatar.id}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: selectedAvatar.id === avatar.id ? '3px solid #1976d2' : 'none',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                        onClick={() => setSelectedAvatar(avatar)}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle1">Add Team Members</Typography>
                  <Tooltip title="Your account is already included" placement="right">
                    <InfoIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Tooltip>
                </Box>

                <UserSelect
                  onUserChange={users => setSelectedUsers(users)}
                  filterIdentity
                  status={['active']}
                />

                <Button
                  type="submit"
                  variant="contained"
                  buttonText="Create Team"
                  fullWidth
                  disabled={loading || values.title == null || values.title === ''}
                  sx={{ mt: 3 }}
                />
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Drawer>
  );
}

const mutation = gql(`
  mutation TeamCreate($input: TeamCreateInput!) {
    teamCreate(input: $input) {
      id
      name
      avatar
      createdAt
      users {
        items {
          id
          firstName
          lastName
          fullName
          email
        }
      }
    }
  }
`);
