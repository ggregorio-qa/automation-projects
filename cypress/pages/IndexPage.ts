import { BasePage } from "./BasePage";

export class IndexPage extends BasePage{
    private locators = {
        menuButton : 'div.bm-burger-button',
        menuWrapper : 'div.bm-menu-wrap',
        shoppingCartButton : 'a[data-test="shopping-cart-link"]',
        menuItems : "nav.bm-item-list",
        cardItems : 'div.inventory_list',
        cardItem : 'div.inventory_item',
        itemName : '[data-test="inventory-item-name"]',
        addToCartButton : 'div.pricebar button',
        itemPrice : '[data-test="inventory-item-price"]',
        cartCounter : 'span.fa-layers-counter.shopping_cart_badge'
    };
    
    constructor() {
        super('/v1/inventory');
    }
    
    openMenu() : Cypress.Chainable<JQuery<HTMLElement>> {
        cy.get(this.locators.menuButton, {timeout: 10000}).should('be.visible').click();
        return cy.get(this.locators.menuItems).should('be.visible');
    }

    navigateTo(menu : string) : Cypress.Chainable<JQuery<HTMLElement>> {
        cy.get('div.bm-menu').then($el => {
            if(!$el.is(':visible')) {
                cy.get(this.locators.menuButton).should('be.visible').click();
                cy.get(this.locators.menuItems).should('be.visible');        
            }
        })

        return cy.get(this.locators.menuItems).find('a').contains(menu).click() as unknown as Cypress.Chainable<JQuery<HTMLElement>>//access menu items
    }

    isPageLoaded() : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('div#inventory_container').first().should('be.visible');
    }

    getCardItems () : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(this.locators.cardItems, {timeout: 10000}).should('be.visible', {timeout: 10000});
    }

    getCardItem() : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(this.locators.cardItem, {timeout: 10000});
    }

    getCardItemIndexByDescription(description: string) : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('div.inventory_item_name').then((titles) => {
            const index = Cypress._.findIndex((titles), (title) => title.innerText.includes(description));
            return cy.get(this.locators.cardItem).eq(index);
        })
    }

    applyFilter(optionValue : string) : Cypress.Chainable<JQuery<HTMLElement>>  {
       return cy.get('select.product_sort_container').select(optionValue);
    }

    verifyAppliedFilter(optionValue: string) : void{
        //get all titles from the DOM, then create a copy of the fetched titles
        if(optionValue === 'az' || optionValue === 'za') {
            let actualTitles : string[] = [];

            this.getCardItem().then((cards) => {
                cy.wrap(cards).each((card) => {
                    cy.wrap(card).find('div.inventory_item_name').invoke('text').then((text) => {
                        actualTitles.push(text.toLowerCase());
                    })
                })
            }).then(() => {
                const sorted = [...actualTitles].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));

                if(optionValue === 'za') {
                    sorted.reverse();
                }
                cy.log(`collected filter: ${actualTitles}`);
                cy.log(`sorted: ${sorted}`);
                expect(actualTitles).to.deep.equal(sorted)
            })
        }

        if(optionValue === 'lohi' || optionValue === 'hilo') {
            //grab price and convert
            let collectPrices : number[] = [];

            this.getCardItem().then(cards => {
                cy.wrap(cards).each(card => {
                    cy.wrap(card).find('div.inventory_item_price').invoke('text').then(text => {
                        const replacedText = text.replace('$', '');
                        const convertToNum = Number(replacedText);
                        
                        if(isNaN(convertToNum)) {
                            throw new Error(`found text ${text} was unable to convert to number`);
                        } else {
                            collectPrices.push(convertToNum);
                        }
                        
                    })
                })
            }).then(() => {
                const sorted = [...collectPrices].sort((a,b) => a-b);

                if(optionValue === 'hilo') {
                    sorted.reverse();
                }
                cy.log(`collected filter: ${collectPrices}`);
                cy.log(`sorted: ${sorted}`);
                expect(collectPrices).to.deep.equal(sorted);
            }) 
        }
    }
    
    addItemToCart(cardItem : JQuery<HTMLElement>) : Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.wrap(cardItem)
                    .find('button')
                    .should('contain.text', 'ADD TO CART') as unknown as Cypress.Chainable<JQuery<HTMLElement>>;
    }

    verifyCartItems() {
        cy.get(this.locators.cartCounter).invoke('text').then((text) => {
            const converted = Number(text);
            if(isNaN(converted)) {
                throw new Error(`cant converted the fetched number from text: ${text}`);
            } else {
                return converted
            }
        }).then((num) => {
            cy.get(this.locators.cardItem).find('button')
                .then((buttons) => {
                    //check number of remove only
                    const removedButtons = buttons.filter((index, element) => element.innerText === 'REMOVE');
                    
                    //check that number of items matches in the number of added items only
                    expect(num).to.equal(removedButtons.length);
            })
        })
    }

    addAllItemsToCart() {
        cy.intercept('**/')
        cy.get(this.locators.cardItem).find('button').then((buttons) => {
            const filter = buttons.filter(($index, $el) => $el.innerText !== 'REMOVE');
            cy.wrap(filter).each((button) => {
                cy.wrap(button).click();
            })
        })
    }
} 