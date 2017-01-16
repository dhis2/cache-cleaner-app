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
                     'angularLocalStorage',
                     'pascalprecht.translate'
                    ])
.value('DHIS2URL', '../api')

.config(function($translateProvider)  {
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
