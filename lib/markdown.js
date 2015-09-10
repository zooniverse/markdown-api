var MarkdownIt = require('markdown-it');
var MarkdownItContainer = require('markdown-it-container');
var twemoji = require('twemoji');

var markdownIt = new MarkdownIt({ linkify: true, breaks: true });

markdownIt
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-footnote'))
  .use(MarkdownItContainer, 'partners')
  .use(MarkdownItContainer, 'attribution');

var host = {
  production: 'https://www.zooniverse.org',
  staging: 'http://demo.zooniverse.org/panoptes-front-end'
}[process.env.NODE_ENV] || 'http://localhost:3735';

function Markdown(input, project) {
  this.input = input;
  this.project = project;
}

Markdown.prototype.customTags = function(input) {
  var project = this.project;

  return input
    .replace(/(^|[^\w])(\#([-\w\d]{3,40}))/g, function(fullMatch, boundary, fullTag, tagName) {
      if(project) {
        return boundary + '<a href="' + host + '/projects/' + project + '/talk/search?query=' + tagName + '">' + fullTag + '</a>';
      } else {
        return boundary + '<a href="' + host + '/talk/search?query=' + tagName + '">' + fullTag + '</a>';
      }
    })
    .replace(/\^S0*(\d+)/g, function(fullMatch, subjectId) {
      if(project) {
        return '<a href="' + host + '/projects/' + project + '/subjects/' + subjectId + '">' + project + ' - Subject ' + subjectId + '</a>'
      } else {
        return fullMatch;
      }
    })
    .replace(/@([\w-]+)\/([\w-]+)\^S0*(\d+)/g, '<a href="' + host + '/projects/$1/$2/talk/subjects/$3">$1/$2 - Subject $3</a>')
    .replace(/\^C0*(\d+)/g, '<a href="' + host + '/talk/collections/$1">Collection $1</a>')
    .replace(/@([-\w\d]+)/g, function(fullMatch, username) {
      var groups = ['admins', 'moderators', 'researchers', 'scientists', 'team'];
      if(groups.indexOf(username) < 0) {
        return '<a href="' + host + '/users/' + username + '">@' + username + '</a>';
      } else {
        return '@' + username;
      }
    });
};

Markdown.prototype.emoji = function(input) {
  return twemoji.parse(input, function(icon, options, variant) {
    return 'https://twemoji.maxcdn.com/' + options.size + '/' + icon + '.png';
  });
};

Markdown.prototype.render = function(input) {
  return markdownIt.render(input);
};

Markdown.prototype.html = function () {
  return this.emoji(this.customTags(this.render(this.input)));
};

module.exports = Markdown;
