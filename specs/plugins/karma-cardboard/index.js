var fs = require('fs');
var integration = 'http://integration.bookstrap.hackreactor.com';
var local = 'http://localhost:1337';
var request = require('request');
var sprintName = 'shortly-angular';
var pendingJobs;
var updatesFinished = function(){};

var url = {
  dev: local,
  prod: 'http://bookstrap.hackreactor.com',
  api: '/api/v1/assessment/sprint'
};

function CardBoardReporter(baseReporterDecorator) {
  var options = {
    url: url.dev + url.api,
    method: "POST",
    headers: {
      "Content-Type": 'application/json; charset=UTF-8'
    }
  };

  var file;
  try {
    file = fs.readFileSync(__dirname + '/../../.git/config', 'utf-8');
  } catch(err) {
    // TDOD: report this error, maybe email?
    return;
  }

  var user;
  try {
    user = file.match(/(?!.*hackreactor)(github.com)\W*\w*/g)[0].split('/')[1];
  } catch(e){
    // TDOD: report this error, maybe email?
    return;
  }

  baseReporterDecorator(this);
  this.onBrowserComplete = function(browser) {

    var results = browser.lastResult;

    var body = {
      stats: {
        failedTest: results.failed,
        totalTest: results.total,
        name: sprintName,
        type: 'sprint',
        user: user
      },
      secret: 'catreactor'
    };

    options.body = JSON.stringify(body);

    pendingJobs = true;
    request(options, function() {
      updatesFinished();
    });
  };

  this.onExit = function(done) {
    if (pendingJobs) {
      updatesFinished = done;
    } else {
      done();
    }
  };
}

CardBoardReporter.$inject = ['baseReporterDecorator'];

module.exports = {
  'reporter:cardboard': ['type', CardBoardReporter]
};
