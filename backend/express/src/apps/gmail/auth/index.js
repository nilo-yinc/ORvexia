import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import refreshToken from './refresh-token.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/gmail/connections/add',
      placeholder: null,
      description:
        'When asked to input a redirect URL in Google Cloud, enter the URL above.',
      clickToCopy: true,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
  refreshToken,
};