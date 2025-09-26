import {BasePage} from './BasePage';

export class LoginPage extends BasePage{
    private locator = {
        usernameField : 'input[data-test="username"]',
        passwordField : 'input[data-test="password"]',
        submitButton : 'input#login-button'
    }
    constructor() {
        super('/')
    }

    isPageLoaded() {
        cy.get(this.locator.usernameField).should('be.visible');
        cy.get(this.locator.passwordField).should('be.visible');
        cy.get(this.locator.submitButton).should('be.visible');
    }
    fillInputField(locator : string, value : string) : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(locator).type(value);
    } 

    clickLoginButton() : Cypress.Chainable<JQuery<HTMLElement>>{
        return cy.get(this.locator.submitButton).click();
    }

    performLogin(username: string, password: string){
        this.fillInputField(this.locator.usernameField, username);
        this.fillInputField(this.locator.passwordField, password);
        cy.get(this.locator.submitButton).click();
    }

    getInputField(fieldName : string) : Cypress.Chainable<JQuery<HTMLElement>> {
        fieldName = fieldName.toLowerCase();
        return cy.get(`input[data-test="${fieldName}"]`);
    }

    assertErrorMessage(expectedMessage : string) : Cypress.Chainable<JQuery<HTMLElement>>{
        return cy.get('[data-test="error"]', {timeout: 5000}).should('contain.text', expectedMessage);
    }

    getLoginButton() : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[data-test="login-button"]', {timeout: 5000})
    }
}