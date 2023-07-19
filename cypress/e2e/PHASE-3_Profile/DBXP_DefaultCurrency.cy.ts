describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        // cy.wait(6000)
    })

    it("Manage Default Currency", () => {
        cy.get('[id="dropdownMenuLink"]').click();

        cy.get('[class="dropdown-menu show"] [class="dropdown-item"]').each((item) => {
            const dropdDownItems = item.text().trim();
            cy.log(dropdDownItems);

            const selectDropdItems = "My Profile";
            if (dropdDownItems.includes(selectDropdItems)) {
                cy.wait(4000)
                cy.wrap(item).click();
                cy.scrollTo('bottom')

                cy.get('.alignData_ltr > :nth-child(5)').click({ force: true })

                cy.get('[class="mat-radio-label"]').each((currencyList) => {
                    const currency = currencyList.text().trim()
                    cy.log("Currency: " + currency)

                    const selectedCurrency = "USD"
                    if (currency.includes(selectedCurrency)) {
                        cy.wrap(currencyList).click()
                        cy.wait(2000)

                        // Click on confirm button
                        cy.get('[class="confirm-button"]').click()

                        // Verify the currency name on success message
                        cy.get('[class="congratulations-tag mat-dialog-content"]').should('contain', selectedCurrency)
                        cy.log("Selected currency: " + selectedCurrency)

                        // Click on close button
                        cy.get('[class="button close-button"]').click()
                    }
                })
            }

        })

    })
})
