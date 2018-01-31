/* global angular */

'use strict';

/* Services */

var cacheCleanerServices = angular.module('cacheCleanerServices', ['ngResource']);

cacheCleanerServices.service('idbStorageService', function ($window, $q) {

    var indexedDB = $window.indexedDB;

    var db = null;

    var open = function (dbName) {
        var deferred = $q.defer();

        var request = indexedDB.open(dbName);

        request.onsuccess = function (e) {
            db = e.target.result;
            deferred.resolve();
        };

        request.onerror = function () {
            deferred.reject();
        };

        return deferred.promise;
    };

    var dbExists = function(dbName){

        var deferred = $q.defer();

        var request = indexedDB.open(dbName);

        var existed = true;

        request.onsuccess = function (e) {
            request.result.close();

            if(!existed){
                indexedDB.deleteDatabase(dbName);
            }

            deferred.resolve( existed );
        };

        request.onerror = function () {
            deferred.reject();
        };

        request.onupgradeneeded = function () {
            existed = false;
        };

        return deferred.promise;
    };

    var getObjectStores = function(dbName){

        var deferred = $q.defer();

        var request = indexedDB.open(dbName);

        request.onsuccess = function (e) {
            var db = e.target.result;
            deferred.resolve( db.objectStoreNames );
        };

        request.onerror = function () {
            deferred.reject();
        };
        return deferred.promise;
    };

    var deleteDb = function(dbName){

        var deferred = $q.defer();

        var request = indexedDB.deleteDatabase(dbName);

        request.onsuccess = function (e) {
            deferred.resolve( true );
        };

        request.onerror = function (e) {
            console.log('Error in deleting db: ', e);
            deferred.resolve( false );
        };
        return deferred.promise;
    };

    return {
        open: open,
        deleteDb: deleteDb,
        dbExists: dbExists,
        getObjectStores: getObjectStores
    };
})
/* Modal service for user interaction */
.service('ModalService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults)
                customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ['$scope','$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }];
            }

            return $modal.open(tempModalDefaults).result;
        };

    }])
/* service for wrapping sessionStorage '*/
.service('SessionStorageService', function ($window) {
    return {
        get: function (key) {
            return JSON.parse($window.sessionStorage.getItem(key));
        },
        set: function (key, obj) {
            $window.sessionStorage.setItem(key, JSON.stringify(obj));
        },
        clearAll: function () {
            for (var key in $window.sessionStorage) {
                $window.sessionStorage.removeItem(key);
            }
        }
    };
})
.factory('i18nLoader', function ($http, $q, SessionStorageService, DHIS2URL) {
    return function () {
        var promise;
        var userSettings = SessionStorageService.get('USER_SETTING');
        if (userSettings && userSettings.keyUiLocale) {
            i18next.changeLanguage(userSettings.keyUiLocale);
            promise = $q.when([]);
        }
        else {
            promise = $http.get( DHIS2URL + '/userSettings').then(function (response) {
                if(response && response.data && response.data.keyUiLocale){
                    i18next.changeLanguage(response.data.keyUiLocale);
                }
            });
        }
        return promise;
    };
});
