import './services.js';
import './directives.js';
import './controllers.js';
import './filters.js';
import '../styles/style.css';
import i18nextResources from '../i18n/resources';

i18next.init({
  returnEmptyString: false,
  fallbackLng: false,
  keySeparator: '|',
  resources: i18nextResources
});

/* App Module */
const cacheCleaner = angular.module('cacheCleaner', [
    'ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'cacheCleanerDirectives',
    'cacheCleanerControllers',
    'cacheCleanerServices',
    'cacheCleanerFilters',
    'angularLocalStorage',
    'jm.i18next'
  ])
  .value('DHIS2URL', '../api');
