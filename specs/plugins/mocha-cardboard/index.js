// cardboard runs in the browser and Node
'use strict';
var cardboard;
var dots, file, user;
var integration = 'http://integration.bookstrap.hackreactor.com';
var local = 'http://localhost:1337';
var name = 'shortly-angular';

var url = {
  dev: local,
  prod: 'http://bookstrap.hackreactor.com',
  api: '/api/v1/assessment/sprint'
};

// reference the stando process.exit to call it later
// we must override it here because once process.exit is called
// by mocha, you cannot stop it and cannot perform any async stuff since the
// event loop has stopped.
process.originalExit = process.exit;
var options;
var request = require('request');
var Dots = require('mocha').reporters.Dot;
var fs = require('fs');


process.exit = function(code) {
  request(options, function() {
    process.originalExit(code);
  });
};

// read .git/config to get github username
// keep it seek for certainty
try {
  file = fs.readFileSync(__dirname + '/../../.git/config', 'utf-8');
} catch(err) {
  // TDOD: report this error, maybe email?
  return;
}

cardboard = function(runner) {
  // parse contents of .git/config and get the current user github
  try {
    user = file.match(/(?!.*hackreactor)(github.com)\W*\w*/g)[0].split('/')[1];
  } catch(e) {
    // TDOD: report this error, maybe email?
    return;
  }
  options = {
    url: url.prod + url.api,
    method: "POST",
    headers: {
      "Content-Type": 'application/json; charset=UTF-8'
    }
  };
  // call the defaults Dots reporter and gain access to the stats
  dots = new Dots(runner);

  // send stats to bookstrap when test end
  runner.on('end', function() {
    var body = {
      stats: {
        failedTest: dots.stats.failures,
        totalTest: dots.stats.tests,
        name: name,
        type: 'sprint',
        user: user
      },
      secret: 'catreactor'
    };

    options.body = JSON.stringify(body);
  });
};

module.exports = cardboard;
// access window in browser || global in node
