import { defaultTokens, loadHtml, replaceTokens } from './email';

export function taskCreatedEmail(props: {
  userFirstName: string;
  taskTitle: string;
  taskPriority: string;
  taskDueDate: string;
  taskDescription: string;
}): string {
  const html = loadHtml('./taskCreated.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#USER_FIRST_NAME#': props.userFirstName,
      '#TASK_TITLE#': props.taskTitle,
      '#TASK_PRIORITY#': props.taskPriority,
      '#TASK_DUE_DATE#': props.taskDueDate,
      '#TASK_DESCRIPTION#': props.taskDescription
    }
  });
}
