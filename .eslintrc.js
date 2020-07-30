const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    globals: {
        Cypress: 'readonly',
        before: 'readonly',
        after: 'readonly',
        cy: 'readonly',
    }
}
