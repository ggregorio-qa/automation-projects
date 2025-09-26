import { defineConfig } from "cypress";
import allureWriter from "@shelex/cypress-allure-plugin/writer";

export default defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com", // change to your app
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on, config) {
      allureWriter(on, config); // enable allure results
      // node event listeners here
      return config;
    },
  },
  watchForFileChanges: false,
  screenshotOnRunFailure : true,
  video : false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
  },
});
