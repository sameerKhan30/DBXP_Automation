import { defineConfig } from "cypress";

module.exports = defineConfig({
  projectId: '6675rf',
  videosFolder: "cypress/videos",
  screenshotsFolder: "cypress/screenshots",
  fixturesFolder: "cypress/fixtures",
  viewportWidth: 1400,
  viewportHeight: 900,
  pageLoadTimeout: 90000,
  e2e: {
    // baseUrl: "http://dbxpinnom.comviva.com/mbw/#/mbw/login", //IM
    baseUrl: "http://dbxp.int.comviva.com/mbw/#/mbw/login", //Standalone

    setupNodeEvents(on: any, config: any) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on);

      // here config.env.environment will fetch the value we pass from script i.e. --env environment=standalone
    },
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "reports",
    reportFilename: "mbw-e2e-report",
    charts: true,
    reportPageTitle: "MBW",
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  video: false,
});
