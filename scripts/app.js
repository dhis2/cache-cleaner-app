import './services.js';
import './directives.js';
import './controllers.js';
import './filters.js';
import '../styles/style.css';

/* App Module */

const cacheCleaner = angular.module('cacheCleaner',
                    ['ui.bootstrap',
                     'ngRoute',
                     'ngCookies',
                     'ngSanitize',
                     'cacheCleanerDirectives',
                     'cacheCleanerControllers',
                     'cacheCleanerServices',
                     'cacheCleanerFilters',
                     'd2Services',
                     'd2Controllers',
                     'angularLocalStorage',
                     'pascalprecht.translate',
                     'd2HeaderBar'])

.value('DHIS2URL', '..')

.config(($translateProvider) => {
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
