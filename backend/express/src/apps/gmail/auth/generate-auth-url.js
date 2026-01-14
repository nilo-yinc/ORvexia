const { URLSearchParams } = require('url');
const authScope = require('../common/auth-scope.js');

module.exports = async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID,
    redirect_uri: redirectUri,
    prompt: 'select_account consent',
    scope: authScope.join(' '),
    response_type: 'code',
    access_type: 'offline',
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
