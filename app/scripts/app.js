'use strict';

angular
  .module('moodtrackerApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'hmTouchEvents',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
