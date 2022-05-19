import { parseSelectorWithDataTest } from './helper/parseSelectorWithDataTest.js'

/**
 * Transforms values in curly braces to a data-test selector
 *
 * @param {Function} originalFn
 * @param {string} selectors
 * @param {Object} [options]
 * @param {string} [options.prefix]
 * @returns {Object}
 */
const get = (originalFn, selectors, options = {}) => {
    const { prefix, ...restOptions } = options
    const selector = parseSelectorWithDataTest(selectors, prefix)
    return originalFn(selector, restOptions)
}

Cypress.Commands.overwrite('get', get)
