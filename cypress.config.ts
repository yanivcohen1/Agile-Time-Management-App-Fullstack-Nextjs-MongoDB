import { defineConfig } from 'cypress'

export default defineConfig({
   e2e: {
    baseUrl: 'http://localhost:3000',
    reporter: process.env.CYPRESS_REPORTER || 'spec',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: false,
      embeddedScreenshots: true,
      inlineAssets: true
    },
    setupNodeEvents(on, config) {
      if (process.env.CYPRESS_REPORTER === 'cypress-mochawesome-reporter') {
        require('cypress-mochawesome-reporter/plugin')(on);
      }
      // implement node event listeners here
      return config;
    },
  },
})