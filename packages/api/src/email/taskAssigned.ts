import { defaultTokens, loadHtml, replaceTokens } from './email';

export function taskAssignedEmail(props: {
  userFirstName: string;
  taskName: string;
  teamName: string;
  taskPriority: string;
  taskDueDate: string;
}): string {
  const html = loadHtml('./taskAssigned.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#TASK_NAME#': props.taskName,
      '#TEAM_NAME#': props.teamName,
      '#TASK_PRIORITY#': props.taskPriority,
      '#TASK_DUE_DATE#': props.taskDueDate
    }
  });
}
