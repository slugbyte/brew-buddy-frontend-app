'use strict';

require('./_signin.scss');

const angular = require('angular');
// const brewBuddy = angular.module('brewBuddy');
angular.module('brewBuddy')
.controller('SigninController', ['$log', '$location','authService', SigninController]);

function SigninController($log, $location, authService){
  $log.debug('init signinCtrl');

  this.getToken = function(){
    $log.debug('signinCtrl.getToken');
    authService.getToken()
    .then( () => $location.path('/user'));
  };

  this.signin = function(){
    $log.debug('signinCtrl.signin');
    authService.signin(this.user)
    .then( token => {
      $log.info('token', token);
      $location.path('/user');

    })
    .catch( err => {
      $log.error(err);
    });
  };
}
