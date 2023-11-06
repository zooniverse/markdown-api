var express = require('express');
var bodyParser = require('body-parser');
const { utils } = require('markdownz');
var morgan = require('morgan');
var cors = require('./lib/cors');

var app = express()
  .use(cors)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(morgan('dev'));

app.post('/html', function(req, res) {
  params = req.body;
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  html = utils.getHtml({
    baseURI: 'https://www.zooniverse.org',
    content: params.markdown,
    project: params.project
  })
  res.end('<div>' + html + '</div>');
});

app.get('/', function(req, res) {
  res.statusCode = 200;
  res.end();
});

var server = app.listen(parseInt(process.env.MARKDOWN_PORT) || 2998);
