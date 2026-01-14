const defineApp = require('../../helpers/define-app.js');
const addAuthHeader = require('./common/add-auth-header.js');
const auth = require('./auth/index.js');
const triggers = require('./triggers/index.js');
const dynamicData = require('./dynamic-data/index.js');
const actions = require('./actions/index.js');

module.exports = defineApp({
  name: 'Gmail',
  key: 'gmail',
  baseUrl: 'https://mail.google.com',
  apiBaseUrl: 'https://gmail.googleapis.com',
  iconUrl: '{BASE_URL}/apps/gmail/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/gmail/connection',
  primaryColor: '#ea4335',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
  actions,
});