var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('./lib/cors');
var Markdown = require('./lib/markdown');

var app = express()
  .use(cors)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(morgan('dev'));

app.post('/html', function(req, res) {
  params = req.body;
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  markdown = new Markdown(params.markdown, params.project);
  res.end('<div>' + markdown.html() + '</div>');
});

var server = app.listen(parseInt(process.env.MARKDOWN_PORT) || 2998);
