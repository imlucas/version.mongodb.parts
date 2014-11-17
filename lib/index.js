var express = require('express'),
  helmet = require('helmet'),
  compress = require('compression'),
  cors = require('express-cors'),
  mvm = require('mongodb-version-manager'),
  fs = require('fs'),
  README = fs.readFileSync(__dirname + '/../README.md');

var app = module.exports = express();
app.config = require('./config')({
  listen: 'http://127.0.0.1:3000'
});

app.use(helmet());
app.use(compress());
app.use(cors());

function opts(req, res, next){
  req.locals = {
    opts: {
      branch: req.param('branch', 'master'),
      platform: req.param('platform'),
      bits: req.param('bits', '64'),
      version: req.param('version'),
      debug: req.param('debug'),
      distro: req.param('distro')
    }
  };

  if(req.locals.opts.platform === 'darwin') req.locals.opts.platform = 'osx';
  next();
}

function resolve(req, res, next){
  mvm.resolve(req.locals.opts, function(err, data){
    if(err){
      return res.status(400).send(err.message);
    }
    req.locals.version = data;
    res.set({
      'mongodb-version': req.param('version') + '=' + req.locals.version.version
    });
    next();
  });
}

app.get('/', function(req, res){
  res.set('content-type', 'text/plain').send(README);
});

app.get('/api/v1/:version', opts, resolve, function(req, res){
  res.format({
    'text/plain': function(){
      res.send(req.locals.version.url);
    },
    'application/json': function(){
      res.send(req.locals.version);
    }
  });
});

app.get('/download/:version', opts, resolve, function(req, res){
  res.redirect(req.locals.version.url);
});
