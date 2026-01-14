const { URLSearchParams } = require('url');

const authScope = require('../common/auth-scope.js');

const refreshToken = async ($) => {
  const params = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post(
    'https://oauth2.googleapis.com/token',
    params.toString(),
    {
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: authScope.join(' '),
    tokenType: data.token_type,
  });
};

module.exports = refreshToken;
