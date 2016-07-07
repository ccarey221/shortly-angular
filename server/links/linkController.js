var Q = require('q');
var util = require('../config/utils.js');
var Link = require('./linkModel.js');

// Promisify a few mongoose methods with the `q` promise library
var findLink = Q.nbind(Link.findOne, Link);
var createLink = Q.nbind(Link.create, Link);
var findAllLinks = Q.nbind(Link.find, Link);

module.exports = {

  allLinks: function (req, res, next) {
    findAllLinks({})
      .then(function (links) {
        res.json(links);
      })
      .fail(function (error) {
        next(error);
      });
  },

  newLink: function (req, res, next) {
    var url = req.body.url;
    if (!util.isValidUrl(url)) {
      return next(new Error('Not a valid url'));
    }

    findLink({url: url})
      .then(function (match) {
        if (match) {
          res.send(match);
        } else {
          return util.getUrlTitle(url);
        }
      })
      .then(function (title) {
        if (title) {
          var newLink = {
            url: url,
            visits: 0,
            baseUrl: req.headers.origin,
            title: title
          };
          return createLink(newLink);
        }
      })
      .then(function (createdLink) {
        if (createdLink) {
          res.json(createdLink);
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  navToLink: function (req, res, next) {
    findLink({code: req.params.code})
      .then(function (link) {
        if (!link) {
          return next(new Error('Link not added yet'));
        }

        link.visits++;
        link.save(function (err, savedLink) {
          if (err) {
            next(err);
          } else {
            res.redirect(savedLink.url);
          }
        });
      })
      .fail(function (error) {
        next(error);
      });
  }

};
