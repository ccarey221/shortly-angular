angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links) {
  // Your code here
  $scope.link = {};

  $scope.addLink = function (link) {
    // console.log("????", link);
    Links.addOne({url: link}).then(function(response) {
      console.log("we loaded!", response);
    });
  };

});
