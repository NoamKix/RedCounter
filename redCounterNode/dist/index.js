var JiraClient = require('jira-connector');
var _ = require("underscore");

var jira = new JiraClient({
    host: 'redkix.atlassian.net',
    basic_auth: {
        base64: 'bm9hbW46TWx0QDE5ODc'
    }
});

jira.search.search({
    jql: 'status=1 and issuetype=bug',
    fields: ['components']
}, function(error, issue) {
    var groups = _.groupBy(issue.issues, function(issue) {
        return issue.fields.components[0].name;
    });
    _.each(groups, function(item, name) {
        console.log(name, item.length);
    });
    console.log('error', error);
});