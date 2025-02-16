import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { Resend } from 'resend';
import { splitArrayToChunks } from '../helpers';

dotenv.config();

export function replaceTokens({
  html,
  tokens
}: {
  html: string;
  tokens: Record<string, string>;
}): string {
  return Object.entries(tokens).reduce(
    (result, [key, value]) => result.replaceAll(key, value),
    html
  );
}

export function loadHtml(filename: string): string {
  return readFileSync(new URL(filename, import.meta.url), 'utf-8');
}

export async function sendEmail(props: {
  to: string[];
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const promises = props.to.map(to => {
    return () =>
      resend.emails.send({
        from: 'No-reply <no-reply@mail.dosyncapp.com>',
        to,
        subject: props.subject,
        html: props.htmlContent
      });
  });

  for (const batch of splitArrayToChunks(promises, 100)) {
    await Promise.all(batch.map(promise => promise()));
  }
}

export function defaultTokens() {
  return {
    '#SUPPORT_EMAIL_ADDRESS#': 'support@dosyncapp.com'
  };
}
