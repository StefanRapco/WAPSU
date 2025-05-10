import { defaultTokens, loadHtml, replaceTokens } from './email';

export function teamInviteEmail(props: { userFirstName: string; teamName: string }): string {
  const html = loadHtml('./teamInvite.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#TEAM_NAME#': props.teamName
    }
  });
}
