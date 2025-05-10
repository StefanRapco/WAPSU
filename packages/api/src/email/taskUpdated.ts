import { defaultTokens, loadHtml, replaceTokens } from './email';

export function taskUpdatedEmail(props: {
  userFirstName: string;
  taskName: string;
  teamName: string;
  changes: string;
}): string {
  const html = loadHtml('./taskUpdated.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#TASK_NAME#': props.taskName,
      '#TEAM_NAME#': props.teamName,
      '#CHANGES#': props.changes
    }
  });
}
