import { defaultTokens, loadHtml, replaceTokens } from './email';

export function userInviteEmail(props: { userFirstName: string }): string {
  const html = loadHtml('./userInvite.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName
    }
  });
}
