import { defaultTokens, loadHtml, replaceTokens } from './email';

export function teamRoleChangedEmail(props: {
  userFirstName: string;
  teamName: string;
  newRole: string;
  rolePermissions: string;
}): string {
  const html = loadHtml('./teamRoleChanged.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#TEAM_NAME#': props.teamName,
      '#NEW_ROLE#': props.newRole,
      '#ROLE_PERMISSIONS#': props.rolePermissions
    }
  });
}
