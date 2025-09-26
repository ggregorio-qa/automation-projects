import {LoginPage} from '../pages/LoginPage';
import {userTypes, PASSWORD} from '../fixtures/TestData';

describe('Login tests', () => {
    
    let loginPage : LoginPage;
    before(() => {
        loginPage = new LoginPage();
    })

    beforeEach(() => {
        cy.visit('/');
        loginPage.isPageLoaded();
    })

    it('should able to return error on invalid login' , () => {
        cy.allure().step('Enter invalid username/password', true);
        cy.allure().step('Click Login', false);
        loginPage.performLogin(userTypes.locked_out, PASSWORD);

        cy.allure().step('error message that used account is locked out should be prompted', true);
        loginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    })

    it('should prompt error on missing field inputs - username' , () => {
        cy.allure().step('username is required prompted on missing username value', true)
        loginPage.getInputField('username').clear();
        loginPage.clickLoginButton().then(() => {
            loginPage.assertErrorMessage('Username is required');
        });
    })

    it('should prompt error on missing field inputs - password' , () => {
        cy.allure().step('password is required prompted on missing password value', true)
        loginPage.getInputField('username').type(userTypes.standard);
        loginPage.getInputField('password').clear();
        loginPage.clickLoginButton().then(() => {
            loginPage.assertErrorMessage('Password is required');
        });
    })

    it('should prompt error on missing field inputs - both username and password' , () => {
        cy.allure().step('username is required prompted on missing username and password value', true)
        loginPage.getLoginButton().click();
        loginPage.assertErrorMessage('Username is required');
    })

    it('should be able to perform successful login', () => {
        cy.allure().step('Enter valid username (standard_user) and password', true);
        loginPage.performLogin(userTypes.standard, PASSWORD);

        cy.allure().step('Default inventory page should be prompted', true);
        cy.url().should('include', '/inventory');
        cy.get('[data-test="inventory-container"]').should('be.visible', {timeout: 1000});
    })
})