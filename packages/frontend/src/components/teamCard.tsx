import { CalendarToday, Group } from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamAvatarsArray } from '../images/images';
import { Badge as CustomBadge } from './badge';
import { Button } from './button';
import { getInitials } from './navigation/accountMenu';
import { CircularAvatar } from './navigation/circularAvatar';
import { Typography } from './typography';

interface TeamCardProps {
  readonly team: {
    readonly id: string;
    readonly name: string;
    readonly avatar: string;
    readonly description?: string | null | undefined;
    readonly createdAt: string;
    readonly users: {
      readonly items: Array<{
        readonly id: string;
        readonly firstName: string;
        readonly lastName: string;
        readonly email: string;
        readonly teamRole: {
          readonly label: string;
          readonly value: string;
        };
      }>;
    };
  };
}

export function TeamCard({ team }: TeamCardProps): ReactNode {
  const navigate = useNavigate();
  const remainingMembers = team.users.items.length - 4;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: 'cover',
          objectPosition: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
        image={teamAvatarsArray.find(avatar => avatar.id === team.avatar)?.src}
        alt={team.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {team.name}
            </Typography>
            <CustomBadge variant="positive" notification="Active" />
          </Stack>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {team.description ?? 'No description found...'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'background.paper'
                }
              }}
            >
              {team.users.items.slice(0, 4).map(user => (
                <Tooltip
                  key={user.id}
                  title={
                    <Box sx={{ p: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          alt={`${user.firstName} ${user.lastName}`}
                          sx={{ width: 40, height: 40 }}
                        >
                          <CircularAvatar size="s">
                            {getInitials(`${user.firstName} ${user.lastName}`)}
                          </CircularAvatar>
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  }
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '& .MuiTooltip-arrow': {
                          color: 'background.paper'
                        }
                      }
                    }
                  }}
                >
                  <Avatar alt={`${user.firstName} ${user.lastName}`} sx={{ width: 32, height: 32 }}>
                    <CircularAvatar size="s">
                      {getInitials(`${user.firstName} ${user.lastName}`)}
                    </CircularAvatar>
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            {remainingMembers > 0 && (
              <>
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {`+${remainingMembers} members`}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  }
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '& .MuiTooltip-arrow': {
                          color: 'background.paper'
                        }
                      }
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <CircularAvatar size="s">
                      {remainingMembers <= 9 ? `+${remainingMembers}` : '9+'}
                    </CircularAvatar>
                  </Avatar>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label={`Created ${format(new Date(team.createdAt), 'MMM d, yyyy')}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              '& .MuiChip-label': { color: 'rgba(0, 0, 0, 0.87)' },
              '& .MuiChip-icon': { color: 'rgba(0, 0, 0, 0.54)' }
            }}
          />
          <Chip
            icon={<Group fontSize="small" />}
            label={`${team.users.items.length} Act. Team Members`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              '& .MuiChip-label': { color: 'rgba(0, 0, 0, 0.87)' },
              '& .MuiChip-icon': { color: 'rgba(0, 0, 0, 0.54)' }
            }}
          />
        </Box>

        <Button buttonText="Visit team" onClick={() => navigate(`${team.id}`)} sx={{ mt: 3 }} />
      </CardContent>
    </Card>
  );
}
