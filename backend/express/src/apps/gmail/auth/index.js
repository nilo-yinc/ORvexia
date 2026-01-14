const generateAuthUrl = require('./generate-auth-url.js');
const verifyCredentials = require('./verify-credentials.js');
const refreshToken = require('./refresh-token.js');
const isStillVerified = require('./is-still-verified.js');

module.exports = {
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