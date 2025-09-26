declare global {
  namespace Cypress {
    interface Chainable {
      performLogin(username: string, password: string): Chainable<void>
      
    }
  }
}

export {}