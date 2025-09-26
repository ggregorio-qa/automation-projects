export abstract class BasePage {
    constructor(private endpoint : string) {}

    visit(endpoint : string) {
        cy.visit(`${endpoint}`);
    }

    abstract isPageLoaded() : void
}