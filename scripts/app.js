import './services.js';
import './directives.js';
import './controllers.js';
import './filters.js';
import '../styles/style.css';

i18next.init({
  returnEmptyString: false,
  fallbackLng: false,
  keySeparator: '|',
  resources: {
    ar: { translation: require('../i18n/ar.po') },
    ckb: { translation: require('../i18n/ckb.po') },
    es: { translation: require('../i18n/es.po') },
    fr: { translation: require('../i18n/fr.po') },
    id: { translation: require('../i18n/id.po') },
    lo: { translation: require('../i18n/lo.po') },
    prs: { translation: require('../i18n/prs.po') },
    ps: { translation: require('../i18n/ps.po') },
    pt: { translation: require('../i18n/pt.po') },
    sv: { translation: require('../i18n/sv.po') },
    vi: { translation: require('../i18n/vi.po') }
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
