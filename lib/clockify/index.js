'use strict';

const clockifyService = {};

// Dependencies

clockifyService._httpsHelper = require('../helper/https');
clockifyService._dateHelper = require('../helper/date');
clockifyService._config = require('../../config');
clockifyService._report = require('./report');

clockifyService._getProjectNamesByids = function(projectIds, clockifyOptions, workspaceId) {
  return Promise.all(projectIds.map(async (projectId) => {
    const clockifyBaseUrl = clockifyService._config['CLOCKIFY_PROJECTS_URL']+'/'+projectId;
    const formattedUrl = clockifyBaseUrl.replace("{workspaceId}", workspaceId);

    const res = await clockifyService._httpsHelper.makeRequestAsync(formattedUrl, clockifyOptions);
    if (res.statusCode !== 200) throw new Error(
      'Error getting project name from the Clockify API. The project ID was:'+projectId,
    );

    const responseData = await clockifyService._httpsHelper.parseResponseData(res);
    const projectObject = JSON.parse(responseData);
    return { 
      projectId: projectObject.id,
      name: projectObject.name,
    };
  }));
};

clockifyService.getUserEntriesFromClockify = async function(entryTimePayload, clockifyOptions) {
  const date = clockifyService._dateHelper.daysAgo(entryTimePayload.daysAgo).toISOString();
  const clockifyUrl = clockifyService._config['CLOCKIFY_ENTRIES_URL']+'?start='+date+'&end='+new Date().toISOString()+"&page=1&page-size=100";
  const updateWorkspace = clockifyUrl.replace('{workspaceId}', entryTimePayload.workspaceId);
  const formattedUrl = updateWorkspace.replace('{userId}', entryTimePayload.userId);

  const res = await clockifyService._httpsHelper.makeRequestAsync(formattedUrl, clockifyOptions);
  if (res.statusCode !== 200) throw new Error('Error connecting to Clockify API.');

  const responseData = await clockifyService._httpsHelper.parseResponseData(res);
  const entries = JSON.parse(responseData);
  const projectIds = [...new Set(entries.map(entry => entry.projectId).filter(Boolean))];
  const projectPromise = clockifyService._getProjectNamesByids(projectIds, clockifyOptions, entryTimePayload.workspaceId);

  const filteredEntries = entries.filter(entry => entry.tagIds && entry.tagIds.includes('5e8b77715aa34a6709fc6b10'));
  
  const projectObjects = clockifyService._report.processClockifyData(filteredEntries);

  const projectNames = (await projectPromise).reduce((projects, project) => {
    projects[project.projectId] = project.name;
    return projects;
  }, {});
  
  return projectObjects.map(project => ({...project, name: projectNames[project.name] }));
}

clockifyService.getUserFromClockify = async function(clockifyOptions) {
  const clockifyUrl = clockifyService._config['CLOCKIFY_USER_URL'];

  const res = await clockifyService._httpsHelper.makeRequestAsync(clockifyUrl, clockifyOptions);
  if (res.statusCode !== 200) throw new Error('Error connecting to Clockify API.');
  return await clockifyService._httpsHelper.parseResponseData(res);
}

clockifyService.getWorkspacesFromClockify = async function(options) {
  const clockifyUrl = clockifyService._config['CLOCKIFY_WORKSPACE_URL'];
  const clockifyOptions = {
    headers: { 
      'Content-Type': 'application/json',
      "X-Api-Key": options.apiToken,
    }
  };

  const res = await clockifyService._httpsHelper.makeRequestAsync(clockifyUrl,clockifyOptions);
  if (res.statusCode !== 200) throw new Error('Error connecting to Clockify API.');
  const workspaceResponseData = await clockifyService._httpsHelper.parseResponseData(res);
  const workspaceObject = JSON.parse(workspaceResponseData);
  const userResponseData = await clockifyService.getUserFromClockify(clockifyOptions);
  const userObjects = JSON.parse(userResponseData);
  const entryTimePayload = {
    workspaceId: workspaceObject[0].id,
    userId: userObjects.id,
    daysAgo: options.daysAgo,
  };
  return await clockifyService.getUserEntriesFromClockify(entryTimePayload, clockifyOptions);
}


module.exports = clockifyService;
