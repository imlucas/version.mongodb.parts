var app = require('../'),
  request = require('supertest'),
  assert = require('assert');

describe('version.mongodb.parts', function(){
  it('Where can I download the latest stable version of MongoDB for OSX?', function(done){
    request(app)
      .get('/download/stable?platform=osx')
      .end(function(err, res){
        if(err) return done(err);

        assert(/\/download\/\d+\.[68]+\.\d+/.test(res.headers.location));
        done(err);
      });
  });

  it('Do you know where I might be able to download the 2.8 rc0 for ubuntu 64-bit?', function(done){
    request(app)
      .get('/download/unstable?platform=linux&bits=64')
      .end(function(err, res){
        if(err) return done(err);

        assert(/\/download\/\d+\.[89]+\.\d+(:-rc\d+)?/.test(res.headers.location));
        done(err);
      });
  });
});
