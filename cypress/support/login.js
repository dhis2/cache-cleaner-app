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

const loginThroughForm = () => {
    const prefix = 'dhis2-adapter'
    const getOptions = { prefix, log: false }
    const formGet = selector => cy.get(selector, getOptions)
    const loginUrl = Cypress.env('dhis2_base_url')
    const username = Cypress.env('dhis2_username')
    const password = Cypress.env('dhis2_password')

    cy.visit('/')
    formGet('{loginserver} input').type(loginUrl)
    formGet('{loginname} input').type(username)
    formGet('{loginpassword} input').type(password)
    formGet('{loginsubmit}').click()
    cy.get('{homeheadline}', { log: false })

    return cy
}

const login = () => {
    /**
     * This is done through cy.request(...)
     * because Cypress doesn't allow multiple domains per test:
     * https://docs.cypress.io/guides/guides/web-security.html#One-Superdomain-per-Test
     */
    loginBasicAuth()
    loginThroughForm()

    return cy
}

Cypress.Commands.add('login', login)
