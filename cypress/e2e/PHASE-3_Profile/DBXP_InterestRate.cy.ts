describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        cy.fixture("InterestRate.json").then((interestRate) => { // Take data form ApplyCreditCard.json file
            this.interestRates = interestRate;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    });

    it("Get Interest Rate", () => {
        cy.scrollTo('bottom')
        cy.get('.cards-div > :nth-child(3) > .row').click()

        // cy.get('[class="mat-card mat-focus-indicator mat-card-section"]')
        cy.wait(1000)
        cy.get('.mat-card').then((typeOfInterestRate) => {
            cy.wrap(typeOfInterestRate).find('[class="card-item-text_ltr"]').each((value) => {
                const types = value.text().trim()
                cy.log("Types of interest rate : " + types)

                // Get nterest rate for the Fixed Deposit
                const selection = this.interestRates.InterestRates.savingsInterest
                if (types.includes(selection)) {
                    cy.wrap(value).click()

                    cy.get('.mat-card').then((interestPageData) => {
                        cy.wrap(interestPageData).find('[role="combobox"]').click()
                        cy.wait(3000)

                        cy.get('[role="option"]').each((dropdDown) => {
                            const dropdDownValues = dropdDown.text().trim()
                            cy.log("Ranges : " + dropdDownValues)

                            if (dropdDownValues.includes("FD between 2 Cr to 5cr")) {
                                cy.wrap(dropdDown).click()

                                // Getting table header data
                                cy.get('[class="mat-card mat-focus-indicator mat-card-section"]').then(($tableData) => { // cy.wait(2000)
                                    const header = $tableData.find('[class="mat-header-row cdk-header-row ng-star-inserted"]').text().trim()
                                    cy.log("Columns: " + header)

                                    // Getting row data
                                    const rowData = $tableData.find('[class="mat-row cdk-row ng-star-inserted"]').text().trim()
                                    cy.log("Row data: " + rowData)

                                    // Getting note
                                    const notes = $tableData.find('.applicable_text').text().trim()
                                    cy.log("Notes: " + notes)

                                    // Write table data in json
                                    const readTableData = {
                                        header,
                                        rowData,
                                        notes
                                    }
                                    cy.writeFile('cypress\\fixtures\\InterestRateData.json', [readTableData])
                                })
                            }
                        })
                    })
                }
                // Get nterest rate for the Loan Types
                else if (types.includes(selection)) {
                    cy.wrap(value).click()
                }
            })
        })
    })
})
