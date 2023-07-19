describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        // cy.fixture("ExchangeRates.json").then((exchangeRates) => { // Take data form ApplyCreditCard.json file
        //     this.exchangeRate = exchangeRates;
        // });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    });

    it("Get Exchange Rates", () => {
        cy.scrollTo('bottom')
        cy.get('.cards-div > :nth-child(4) > .row').click()
        cy.wait(2000)

        cy.get('[class="divorlabelortable"]').then(($pageData) => {

            // Get type of currency
            const defaultCurrency = $pageData.find('[class="defaultCurrencyLabel_ltr"]').text().trim()
            cy.log("Currncy type : " + defaultCurrency)

            //  Get header data
            const headerData = $pageData.find('th[role="columnheader"]').text().trim()
            cy.log("Header data : " + headerData)

            //  Get row data
            const rowData = $pageData.find('[class="mat-row cdk-row ng-star-inserted"]').text().trim()
            cy.log("Row data : " + rowData)

            // Get date
            const date = $pageData.find('[class="exchange-note date"] [dir="ltr"]').first().text().trim()
            cy.log("Date : " + date)

            // Get note
            const note = $pageData.find('p[class="date"]').eq(1).text().trim()
            cy.log("Note : " + note)

            const exchangeRateData = { defaultCurrency, headerData, rowData, date, note }

            cy.writeFile("D:\\IB Automation\\cypress\\fixtures\\ExchangeRates.json", [exchangeRateData])

        })


    })
})