/* eslint-disable max-params */
import { parseSelectorWithDataTest } from './helper/parseSelectorWithDataTest.js'

/**
 * Transforms values in curly braces to a data-test selector
 *
 * @param {jQuery} subject
 * @param {string} selectors
 * @param {string} [prefix]
 * @returns {Object}
 */
const find = (originalFn, subject, selectors, options = {}) => {
    const { prefix, ...restOptions } = options
    const selector = parseSelectorWithDataTest(selectors, prefix)
    return originalFn(subject, selector, restOptions)
}

Cypress.Commands.overwrite('find', find)
