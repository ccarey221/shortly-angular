angular.module('shortly.links', [])

.controller('LinksController', function ($scope, Links, Auth) {
  // Your code here
  $scope.data = {};
  // $scope.getAll = function(){

  // }
  $scope.$on('$viewContentLoaded', function() {
      //Here your view content is fully loaded !!
    Links.getAll()
    .then(function(Links) {
      $scope.data.links = Links;
      console.log($scope.data);
    }); 
  });

  $scope.signout = function() {
    Auth.signout();
  };


});
