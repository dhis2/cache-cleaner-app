const LOGIN_END_POINT = 'dhis-web-commons/security/login.action'

const loginBasicAuth = () => {
    const username = Cypress.env('dhis2_username')
    const password = Cypress.env('dhis2_password')
    const loginUrl = Cypress.env('dhis2_base_url')
    const loginAuth = `Basic ${btoa(`${username}:${password}`)}`

    return cy.request({
        url: `${loginUrl}/${LOGIN_END_POINT}`,
        method: 'POST',
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': '',
        },
        headers: { Authorization: loginAuth },
    })
}

const loginDev = () => {
    const loginUrl = Cypress.env('dhis2_base_url')
    const username = Cypress.env('dhis2_username')
    const password = Cypress.env('dhis2_password')

    loginBasicAuth()
    cy.visit('/')
    cy.get('#server').type(loginUrl)
    cy.get('#j_username').type(username)
    cy.get('#j_password').type(password)
    cy.get('{button}', { prefix: 'dhis2-uicore' }).click()
    cy.get('{homeheadline}', { log: false })

    return cy
}

/**
 * This is done through cy.request(...)
 * because Cypress doesn't allow multiple domains per test:
 * https://docs.cypress.io/guides/guides/web-security.html#One-Superdomain-per-Test
 */
const login = () => {
    return loginDev()
}

Cypress.Commands.add('login', login)
