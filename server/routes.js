/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var JiraClient = require('jira-connector');
var _ = require("underscore");

module.exports = function(app) {

    // Insert routes below
    app.use('/api/things', require('./api/thing'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    app.route('/bugs')
        .get(function(req, res) {
            var jira = new JiraClient({
                host: 'redkix.atlassian.net',
                basic_auth: {
                    base64: 'bm9hbW46TWx0QDE5ODc'
                }
            });
            var response;
            jira.search.search({
                jql: 'status in ("open","reopened","in progress") and issuetype=bug',
                fields: ['components']
            }, function(error, issue) {
                var output = {};
                console.log('error', error);
                console.log('issues', issue);
                var groups = _.groupBy(issue.issues, function(issue) {
                    return issue.fields.components[0].name;
                });
                _.each(groups, function(item, name) {
                    console.log(name, item.length);
                    output[name.toLowerCase()] = {
                        'name': name,
                        'bugs': item.length
                    };
                });
                res.send(output);
            });

        });

    app.route('/bugs-qa')
        .get(function(req, res) {
            var jira = new JiraClient({
                host: 'redkix.atlassian.net',
                basic_auth: {
                    base64: 'bm9hbW46TWx0QDE5ODc'
                }
            });
            var response;
            jira.search.search({
                jql: 'status in ("resolved")',
                fields: ['components']
            }, function(error, issue) {
                var output = {};
                console.log('error', error);
                console.log('issues', issue);
                output = {
                    'qa-bugs': issue.total
                };
                res.send(output);
            });

        });
    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });


};