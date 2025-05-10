import { defaultTokens, loadHtml, replaceTokens } from './email';

export function userArchivedEmail(props: { userFirstName: string }): string {
  const html = loadHtml('./userArchived.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName
    }
  });
}
