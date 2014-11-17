var app = require('../'),
  request = require('supertest'),
  assert = require('assert');

function GET(path, done){
  request(app).get(path).end(done);
}

describe('version.mongodb.parts', function(){
  it('Where can I download the latest stable version of MongoDB for OSX?', function(done){
    GET('/download/stable?platform=osx', function(err, res){
      if(err) return done(err);

      assert.equal(res.headers.location.indexOf('http://fastdl.mongodb.org/osx/mongodb-osx-x86_64-'), 0);
      assert(/\d+\.[68]+\.\d+/.test(res.headers['mongodb-version']));
      done(err);
    });
  });

  it('Do you know where I might be able to download the 2.8 rc0 for ubuntu 64-bit?', function(done){
    GET('/download/unstable?platform=linux&bits=64', function(err, res){
      if(err) return done(err);
      assert.equal(res.headers.location.indexOf('http://fastdl.mongodb.org/linux/mongodb-linux-x86_64'), 0);
      assert(/\d+\.[89]+\.\d+(:-rc\d+)?/.test(res.headers['mongodb-version']));
      done(err);
    });
  });
});
