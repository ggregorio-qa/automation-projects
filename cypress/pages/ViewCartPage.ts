import { BasePage } from "./BasePage";
import { IndexPage } from "./IndexPage";

export class ViewCartPage extends BasePage{
    private locators = {
        cartItem : "div.cart_item",
        cartTitle : "div.inventory_item_name",
        cartDesc : "div.inventory_item_desc",
        cartPrice : "div.inventory_item_price",
        removeButton : ".btn_secondary.cart_button",
        viewCartButton : '[data-icon="shopping-cart"]'
    }
    constructor() {
        super('/v1/cart.html')
    }

    isPageLoaded(): void {
        cy.get('#cart_contents_container').should('be.visible');
    }

    moveToViewCartPage() {
        cy.get(this.locators.viewCartButton).scrollIntoView().should('be.visible').click()
    }
    
     getCardDetails(card : JQuery<HTMLElement>) : Cypress.Chainable<{title:string, description: string, price: string}> {
        return cy.wrap(card).find(this.locators.cartTitle).invoke('text').then(titleText => {
            return cy.get(this.locators.cartDesc).invoke('text').then(descText => {
                return cy.wrap(card).find(this.locators.cartPrice).invoke('text').then(priceText => {
                    return {
                        title : titleText,
                        description : descText,
                        price : priceText
                    }
                })
            })
        })
    } 

    getAllCurrentRecords() {
        let currentItems : {title:string, description: string ,price : string}[] = [];

        cy.get(this.locators.cartItem).then(items => {
            cy.wrap(items).each(item => {
                this.getCardDetails(item).then(data => {
                    currentItems.push(data);
                })
            })
        }).then(() => {
            cy.wrap(currentItems).as('currentItems');
        })
    }

    viewImage(card : JQuery<HTMLElement>) : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.wrap(card).find(this.locators.cartTitle).click();
    }
}