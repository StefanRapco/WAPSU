import { defaultTokens, loadHtml, replaceTokens } from './email';

export function codeSignInEmail(props: { code: string }): string {
  const html = loadHtml('./codeSignIn.html');

  return replaceTokens({
    html,
    tokens: {
      ...defaultTokens(),
      '#CODE#': props.code
    }
  });
}
