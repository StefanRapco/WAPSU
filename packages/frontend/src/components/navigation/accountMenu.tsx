import { useMutation } from '@apollo/client';
import { Box, Divider, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '../../gql-generated';
import { Identity } from '../../hooks/useIdentity';
import { Typography } from '../typography';
import { CircularAvatar } from './circularAvatar';
import { MenuItem } from './menuItem';
import { StyledMenu } from './styledMenu';

interface AccountMenuProps {
  readonly identity: Pick<NonNullable<Identity>, 'fullName' | 'email'>;
}

export function AccountMenu(props: AccountMenuProps) {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [signOut] = useMutation(signOutMutation);
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        disableRipple
        onClick={event => setAnchorElUser(event.currentTarget)}
        sx={{ p: 0, img: { borderRadius: '50%', position: 'static !important' } }}
      >
        <CircularAvatar size="s">{getInitials(props.identity.fullName)}</CircularAvatar>
      </IconButton>

      <StyledMenu anchorEl={anchorElUser} setAnchorEl={setAnchorElUser}>
        <Stack
          sx={{
            padding: theme => theme.spacing(3, 5),
            backgroundColor: theme => theme.brandPalette.background.neutral
          }}
        >
          <Typography variant="bodyS">Signed in as</Typography>
          <Typography variant="bodyS">{props.identity.email}</Typography>
        </Stack>
        <Divider />
        <MenuItem
          onClick={() => {
            navigate('/account-settings');
            setAnchorElUser(null);
          }}
          text="Account settings"
        />

        <Divider />
        <MenuItem
          onClick={async () => {
            await signOut({ variables: { input: { email: props.identity.email } } });
            window.location.reload();
            setAnchorElUser(null);
          }}
          text="Sign out"
        />
      </StyledMenu>
    </Box>
  );
}

export function getInitials(name: string) {
  const splitName = name.split(' ');

  if (splitName.length === 1) return splitName[0][0];
  return (splitName[0][0] + splitName[splitName.length - 1][0]).toUpperCase();
}

const signOutMutation = gql(`
  mutation SignOut($input: SignOutInput!) {
    signOut(input: $input)
  }
`);
