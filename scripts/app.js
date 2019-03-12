import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-route';
import 'angular-cookies';
import 'angular-sanitize';
import 'angular-resource';
import 'ng-i18next';

import jquery from 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'angularLocalStorage/dist/angularLocalStorage.min.js';

import './jquery-plugin.js';

import i18next from 'i18next';
import i18nextResources from '../i18n/resources';

import './headerbar.js';
import './services.js';
import './directives.js';
import './controllers.js';
import './filters.js';
import '../styles/style.css';

import 'typeface-roboto';
import 'fontawesome';

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
    'angularLocalStorage',
    'jm.i18next',
    'cacheCleanerDirectives',
    'cacheCleanerControllers',
    'cacheCleanerServices',
    'cacheCleanerFilters',
  ])
  .value('DHIS2URL', '../api');
