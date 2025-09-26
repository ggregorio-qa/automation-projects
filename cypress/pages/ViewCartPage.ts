import { BasePage } from "./BasePage";

export class ViewCartPage extends BasePage{
    
    constructor() {
        super('/v1/cart.html')
    }

    private locators = {
        viewCartButton : '[data-icon="shopping-cart"]'
    }

    isPageLoaded(): void {
        cy.get('#cart_contents_container').should('be.visible');
    }

    moveToViewCartPage() {
        cy.get(this.locators.viewCartButton).scrollIntoView().should('be.visible').click()
    }
}