import {LoginPage, IndexPage, ViewCartPage} from '../pages'
import { userTypes, PASSWORD } from '../fixtures/TestData'
import {IViewCartPages} from '../interfaces/interface'

describe('View Cart page validation' , () => {
    
    let page : IViewCartPages;

    before(() => {
        page = {
            loginPage : new LoginPage(),
            indexPage : new IndexPage(),
            viewCartPage : new ViewCartPage()
        }
    })

    beforeEach(() => {
        cy.session([userTypes.standard, PASSWORD], () => {
            page.loginPage.visit('/');
            page.loginPage.performLogin(userTypes.standard, PASSWORD);
        })
        cy.visit('/v1/inventory.html');
        page.indexPage.addAllItemsToCart();
        cy.get('[data-icon="shopping-cart"]').should('be.visible').click();
        page.viewCartPage.isPageLoaded();
        page.viewCartPage.moveToViewCartPage();
    })

    it('should show the added to cart item', () => {

    })

    it('should be able to view a cart image', () => {

    })

    it('should display correct number of records according to number of added to cart', () => {

    })

    it('should be able to remove a carted item from the list', () => {

    })

    it('should be able to navigate back to item selection', () => {

    })

    it('should be able to proceed to checkout', () => {

    })

    it('should have the page menu be hidden', () => {

    })
})