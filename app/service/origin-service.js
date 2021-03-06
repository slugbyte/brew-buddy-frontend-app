/*global __API_URL__ */
'use strict';

const angular = require('angular');

angular.module('brewBuddy').factory('originService', ['$log', '$q', '$http', 'authService', originService]);

function originService($log, $q, $http, authService){
  let service = {};
  let token = authService.getToken();
  let url = `${__API_URL__}/api/origin`;

  // add functionality to the service
  service.origins = [];

  service.createOrigin = function(data){
    if(!token) return $q.reject(new Error('not token process not allowed'));
    $log.debug('originService.createOrigin');
    return $q((resolve, reject) => {
      $http.post( url , data , {
        headers: {
          authorization: `Bearer ${authService.getToken()}`
        }
      })
      .then( res  => {
        $log.log(`POST ${url}:${res.status} success!`);
        this.origins.push(res.data);
        resolve(res.data);
      })
      .catch( err => {
        $log.error(`POST ${url}:${err.status} failure!`);
        reject(err);
      });
    });
  };

  service.fetchAllOrigins = function(){
    if(!token) return $q.reject(new Error('not token process not allowed'));
    $log.debug('originService.fetchOrigins');
    // $log.warn('old token: ', `Bearer ${authService.getToken()}`);

    return $q((resolve, reject) => {
      authService.getToken()
        .then((token) => {
          $http.get(`${url}/all`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then( res => {
              $log.log(`GET ${url}:${res.status} success!`, res);
              service.origins = res.data;
              console.log('hitting', service.origins);
              resolve(service.origins);
            })
            .catch( err => {
              $log.error(`GET ${url}:${err.status} failure!`, err);
              reject(err);
            });

        });

    // $log.warn('TOKEN: ', authService.getToken());

    });
  };

  service.updateOrigin = function(data){
    if(!token) return $q.reject(new Error('not token process not allowed'));
    $log.debug('originService.updateOrigin');
    return $q((resolve, reject) => {
      $http.put(`${url}/${data._id}`, data , {
        headers: {
          authorization: `Bearer ${authService.getToken()}`
        }
      })
        .then( res => {
          $log.log(`GET ${url}:${res.status} success!`);
          this.origins.forEach((origin, index) => {
            if (origin._id === res.data._id) this.origins[index] = res.data;
          });
          resolve(res.data);
        })
        .catch( err => {
          $log.error(`GET ${url}:${err.status} failure!`);
          reject(err);
        });
    });
  };

  service.deleteOrigin = function(originId){
    if(!token) return $q.reject(new Error('not token process not allowed'));
    $log.debug('originService.deleteOrigin');
    return $q((resolve, reject) => {
      $http.delete(`${url}/${originId}`, {
        headers: {
          authorization: `Bearer ${authService.getToken()}`
        }
      })
        .then((res) => {
          $log.log(`DELETE ${url}:${res.status} success!`);
          this.origins.forEach((origin, index) => {
            if (origin._id === originId) this.origins.splice(index, 1);
          });
          resolve(res.data);
        })
        .catch((err) => {
          $log.error(`DELETE ${url}:${err.status} failure!`);
          reject(err);
        });

    });
  };

  return service;
}
