'use strict'

const _ = require('lodash');
const async = require('async');
const debug = require('debug')('jira-resource');
const request = require('request');

const debugResponse = require('./debugResponse.js');

module.exports = (issue, source, params, callback) => {
    if (!issue) {
        return callback(null);
    }

    if (!params.watchers) {
        return callback(null, issue)
    }

    const watchersUrl = source.url + '/rest/api/2/issue/' + issue.id + '/watchers/';

    async.each(params.watchers,
        (watcher, next) => {
            request({
                method: 'POST',
                uri: watchersUrl,
                auth: {
                    username: source.username,
                    password: source.password
                },
                json: watcher
            }, (error, response) => {
                debugResponse(response);
                next(error);
            })
        },
        (error) => {
            callback(error, issue);
        }
    );
};
