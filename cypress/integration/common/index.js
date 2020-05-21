import { Before } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.visit('/')
        .clearStorage('local')
        .clearStorage('session')
        .clearStorage('indexedDb')

    cy.login()
})
