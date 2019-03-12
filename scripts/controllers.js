/* global angular */

'use strict';

/* Controllers */
var cacheCleanerControllers = angular.module('cacheCleanerControllers', [])

//Controller for settings page
.controller('MainController', [
    '$scope', 'storage', '$window',
    'idbStorageService', 'ModalService',
    'i18nLoader', '$q', 'captureAppIdbCleanerService',
    function($scope, storage, $window,
    idbStorageService, ModalService,
    i18nLoader, $q, captureAppIdbCleanerService) {

    $scope.afterClearing = false;

    var getItemsToClear = function(){

        $scope.lsCacheExists = false;
        $scope.ssCacheExists = false;
        $scope.idCacheExists = false;

        $scope.lsKeys = [];
        $scope.dbKeys = [];
        $scope.ssKeys = [];

        var reservedStorageKeys = ['key', 'getItem', 'setItem', 'removeItem', 'clear', 'length'];

        for(var key in $window.sessionStorage){
            if (reservedStorageKeys.indexOf(key) === -1) {
                $scope.ssKeys.push({id: key, remove: false});
                $scope.ssCacheExists = true;
            }
        }

        for(var key in $window.localStorage){
            if(reservedStorageKeys.indexOf(key) === -1) {
                $scope.lsKeys.push({id: key, remove: false});
                $scope.lsCacheExists = true;
            }
        }

        var idxDBs = ['dhis2ou', 'dhis2', 'dhis2tc', 'dhis2ec', 'dhis2de','dhis2er', 'dhis2ca'];
        const promises = [];
        angular.forEach(idxDBs, function(db){
            promises.push(idbStorageService.dbExists(db).then(function(res){
                if( res ) {
                    $scope.dbKeys.push({id: db, remove: false});
                    $scope.idCacheExists = true;
                }
            }));
        });

        $q.all(promises).then(function(){
            if($scope.dbKeys.some(function(item) { return item.id === 'dhis2ca'; })) {
                captureAppIdbCleanerService.getDatabaseNames().then(function(dbnames) {
                    dbnames.forEach(function(dbname){
                        $scope.dbKeys.push({ id: dbname, remove: false });
                    });
                });

            }
        });

    };

    i18nLoader().then(function(){
        getItemsToClear();
    });

    $scope.clearCache = function(){

        ModalService.showModal({}).then(function(){

            angular.forEach($scope.ssKeys, function(ssKey){
                if(ssKey.remove){
                    $window.sessionStorage.removeItem(ssKey.id);
                    console.log('removed from session storage:  ', ssKey.id);
                }
            });

            angular.forEach($scope.lsKeys, function(lsKey){
                if(lsKey.remove){
                    storage.remove(lsKey.id);
                    console.log('removed from local storage:  ', lsKey.id);
                }
            });

            angular.forEach($scope.dbKeys, function(dbKey){
                if(dbKey.remove){
                    idbStorageService.deleteDb(dbKey.id).then(function(res){
                        if(res){
                            console.log('removed from indexeddb:  ', dbKey.id);
                        }
                        else{
                            console.log('failed to remove from indexeddb:  ', dbKey.id);
                        }
                    });
                }
            });
            $scope.afterClearing = true;
            getItemsToClear();
        });
    };

    $scope.selectAll = function(){
        angular.forEach($scope.ssKeys, function(ssKey){
            ssKey.remove = !ssKey.remove;
        });

        angular.forEach($scope.lsKeys, function(lsKey){
            lsKey.remove = !lsKey.remove;
        });

        angular.forEach($scope.dbKeys, function(dbKey){
            dbKey.remove = !dbKey.remove;
        });
    };
}]);
