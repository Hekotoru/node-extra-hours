'use strict';

const config = {
  TOGGL_ENTRIES_URL: 'https://www.toggl.com/api/v8/time_entries',
  TOGGL_PROJECTS_URL: 'https://www.toggl.com/api/v8/projects',
  CLOCKIFY_ENTRIES_URL: 'https://api.clockify.me/api/v1/workspaces/{workspaceId}/user/{userId}/time-entries',
  CLOCKIFY_PROJECTS_URL: 'https://api.clockify.me/api/v1/workspaces/{workspaceId}/projects',
  CLOCKIFY_WORKSPACE_URL: 'https://api.clockify.me/api/v1/workspaces',
  CLOCKIFY_USER_URL: 'https://api.clockify.me/api/v1/user',
  ZOHO_CREATE_RECORD_URL: 'https://people.zoho.com/people/api/forms/json/Horas_extras_DEV_UX/insertRecord',
  TESTS_DIR: __dirname+'/lib',
  TESTS_FILE_EXT_REGEX: '.test.js$',
  ZOHO_ENABLED: false,
};

module.exports = config;
