import {IndexPage, LoginPage} from '../pages';
import {userTypes, PASSWORD} from '../fixtures/TestData';

describe('Index page test cases', () => {
    let indexPage : IndexPage;
    let loginPage : LoginPage;

    enum filters { //used for checking page filter cases only
        az = 'az',
        za = 'za',
        lohi = 'lohi',
        hilo = 'hilo'
    }

    before(() => {
        indexPage = new IndexPage();
        loginPage = new LoginPage();
    })

    beforeEach(() => {
        cy.session([userTypes.standard, PASSWORD], () => {
            loginPage.visit('/');
            loginPage.performLogin(userTypes.standard, PASSWORD);
        })

        cy.visit('/v1/inventory.html')
    })

    it('should show list of navigation menu', () => {
        enum pageMenu {
            products = 'All Items',
            about = 'About',
            logout = 'Logout',
            reset = 'Reset App State'
        }

        cy.allure().step('Page menu should contain correct list of options', true);
        indexPage.openMenu().then(($el) => {
            cy.wrap($el).find('a').then((links) => {

                cy.allure().step('should have only 4 available links', false);
                cy.wrap(links).should('have.length', 4);
                cy.wrap(links).each((link) => {
                    cy.wrap(link).invoke('text').then(text => {
                        expect(Object.values(pageMenu)).to.include(text);
                    })
                })
            })
        });

        
    })

    it('should show list of inventory', () => {
        indexPage.getCardItem()
            .should('have.length.greaterThan', 1);
    })

    it('should show proper card contents', () => {
        cy.allure().step('Each visible card should have proper contents', true);
        indexPage.getCardItem().then(cards => {
            cy.wrap(cards).each((card) => {
                cy.allure().step('card content title should be visible', false);
                cy.wrap(card).find('div.inventory_item_name').invoke('text').should('not.be.empty');

                cy.allure().step('card content description should be visible', false);
                cy.wrap(card).find('div.inventory_item_desc').invoke('text').should('not.be.empty');

                cy.allure().step('card content price should be visible', false);
                cy.wrap(card).find('div.inventory_item_price').invoke('text').should('not.be.empty');

                cy.allure().step('card content button - add to cart should be visible', false);
                cy.wrap(card).find('button').should('contain.text', 'ADD TO CART');
            })
        })
        
    })

    it('should have page menu hidden by default', () => {
        cy.allure().step('verify that the page menu is hidden', true)
        cy.get('div.bm-menu-wrap', {timeout:5000}).should('not.be.visible');
    })

    it('should be able to sort page contents by name - ascending by default', () => {
        cy.allure().step('verify that the applied filter is Name (A to Z) by default', true)
        cy.get('select.product_sort_container')
            .find('option:selected')
            .should('have.text', 'Name (A to Z)')
        
        cy.allure().step('verify that item titles are displayed alphabetically in ascending order', true)
        indexPage.verifyAppliedFilter('az');
    })

    it('should be able to sort page contents by name - descending order', () => {
        cy.allure().step('verify that item filter can be changed to alphabetical - descending order', true)
        const filterSelection = filters.za;
        indexPage.applyFilter(filterSelection);

        cy.allure().step('verify that items titles are displayed alphabetically in descending order', true)
        indexPage.verifyAppliedFilter(filterSelection);
    })

    it('should be able to sort page contents by price - lowest to highest', () => {
        const filterSelection = filters.lohi;
        indexPage.applyFilter(filterSelection);
        indexPage.verifyAppliedFilter(filterSelection);
    })

    it('should be able to sort page contents by price - highest to highest', () => {
        const filterSelection = filters.hilo;
        indexPage.applyFilter(filterSelection);
        indexPage.verifyAppliedFilter(filterSelection);
    })

    it('should be able to add to cart items', () => {
        indexPage.getCardItemIndexByDescription('Sauce Labs Backpack').then((cardItem) => {
            indexPage.addItemToCart(cardItem).click();
            indexPage.verifyCartItems()
        })
    })

    it('should show correct number of added to cart items', () => {
        indexPage.addAllItemsToCart();
        indexPage.verifyCartItems()
    })

    it('should have footer elements displayed', () => {
        cy.get('footer').should('be.visible');
    })
})