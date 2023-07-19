describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
    })

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    })

    it('Deactivate Card', () => {
        // Click on the my card icon
        cy.get('ul > :nth-child(3) > a > .icon').click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click()
        cy.log("User clicked on the credit card tab");
        cy.wait(500)

        // Click on  Deactivate Card  tab
        cy.get('[ng-reflect-router-link="/my-cards/credit-block-card"]').click({ force: true })
        cy.wait(1000)
        // Capture page elements
        cy.get('[class="block-card-form-section"]').then((pageData) => {
            cy.wrap(pageData).find('[class="col-sm-6 col-pad-lt"]').should('contain', "Deactivate Card")

            // Click on Reason dropdown

            cy.wrap(pageData).find('[role="combobox"]').click()
            cy.get('[role="option"] span').each((reasons) => {
                const list = reasons.text().trim()
                cy.log(list)

                // Select Reason
                if (list.includes("Card Stolen")) {
                    cy.wrap(reasons).click()
                }
            })

            // Click on Proceed button
            cy.get('.ng-star-inserted > .btn').click()

            //  Enter OTP number
            const OTP = "123456"
            cy.get('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
                cy.wrap(enterOTP).first().type(OTP)
                cy.log("User entered OTP : " + OTP)
                cy.wait(1000)

                // Click on the verify button
                cy.get('[class="btn apply-button doblockcard floatRight"]').click();

                // Click on Close button
                cy.wait(1000)
                cy.get('.col-sm-12 > .button').click()
            })

        })
    })
})