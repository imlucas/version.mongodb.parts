var express = require('express'),
  helmet = require('helmet'),
  compress = require('compression'),
  cors = require('express-cors'),
  mvm = require('mongodb-version-manager'),
  fs = require('fs'),
  README = fs.readFileSync(__dirname + '/../README.md');

var app = module.exports = express();
app.config = require('./config')({
  listen: 'http://127.0.0.1:5000'
});

app.use(helmet());
app.use(compress());
app.use(cors());

function opts(req, res, next){
  // @todo: move all of these normalizations into mongodb-version-manager itself.
  req.locals = {
    opts: {
      branch: req.param('branch', 'master'),
      platform: req.param('platform', 'linux').toLowerCase(),
      bits: req.param('bits', '64').replace(/[^0-9]/g, ''),
      version: req.param('version'),
      debug: req.param('debug'),
      distro: req.param('distro')
    }
  };

  if(req.locals.opts.platform === 'darwin'){
    req.locals.opts.platform = 'osx';
  }
  if(req.locals.opts.platform === 'windows'){
    req.locals.opts.platform = 'win32';
  }
  next();
}

function resolve(req, res, next){
  mvm.resolve(req.locals.opts, function(err, data){
    if(err){
      return res.status(400).send(err.message);
    }

    if(['stable', 'unstable', 'latest'].indexOf(req.param('version')) > -1){
      return res.redirect(req.route.path.replace(':version', data.version));
    }

    req.locals.version = data;
    req.locals.version.filename = req.locals.version.artifact;
    next();
  });
}

app.get('/', function(req, res){
  res.set('content-type', 'text/plain').send(README);
});

app.route('/api/v1/:version')
  .get(opts, resolve, function(req, res){
    res.format({
      'text/plain': function(){
        res.set('content-type', 'text/plain')
          .send(req.locals.version.url);
      },
      'application/json': function(){
        res.set('content-type', 'application/json')
          .send(req.locals.version);
      }
    });
  });

app.get('/download/:version', opts, resolve, function(req, res){
  res.redirect(req.locals.version.url);
});
