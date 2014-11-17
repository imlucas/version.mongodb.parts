var nconf = require('nconf');


module.exports = function(defaults){
  nconf.env().argv().use('memory').defaults(defaults);

  // Default to http.
  if(nconf.get('listen').indexOf('http') !== 0){
    nconf.overrides({listen: 'http://' + nconf.get('listen')});
  }

  var parsed = require('url').parse(nconf.get('listen'));
  ['href', 'port', 'hostname', 'protocol'].map(function(k){
    nconf.set(k, parsed[k]);
  });

  // Some versions of node leave the colon on the end.
  nconf.overrides({protocol: nconf.get('protocol').replace(':', '')});
  module.exports = nconf;
  return nconf;
};
