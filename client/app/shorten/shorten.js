angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links, Auth) {
  // Your code here
  $scope.link = {};
  $scope.isValid = 'URL Required';

  $scope.addLink = function (link) {
    // console.log("????", link);

    Links.addOne({url: link}).then(function(response) {
      console.log("we loaded!", response);
    });
  };

  $scope.change = function() {
    if ($scope.link.length === 0) {
      $scope.isValid = 'URL Required';
    } else if ($scope.link.slice(0, 11) === 'http://www.') {
      $scope.isValid = 'Valid URL!';
    } else {
      $scope.isValid = 'Not a valid URL, make sure to start url with http://';
    }
  };

  $scope.signout = function() {
    Auth.signout();
  };



});
