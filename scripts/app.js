import './services.js';
import './directives.js';
import './controllers.js';
import './filters.js';
import '../styles/style.css';

i18next
  .use(i18nextXHRBackend)
  .init({
    returnEmptyString: false,
    fallbackLng: false,
    keySeparator: '|',
    backend: {
      loadPath: '/i18n/{{lng}}.json'
    }
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
  .value('DHIS2URL', '../api')
  .run(function(i18nLoader) {
    i18nLoader();
  });
