import { defaultTokens, loadHtml, replaceTokens } from './email';

export function userProfileUpdatedEmail(props: { userFirstName: string; changes: string }): string {
  const html = loadHtml('./userProfileUpdated.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#CHANGES#': props.changes
    }
  });
}
