describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
        cy.fixture("CreditCardDetails.json").then((getPhysiicalCard) => {
            // Take Sigle File From (ApplyLoan.json) Fixture File
            this.physicalCard = getPhysiicalCard;
        });
    })

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        // cy.wait(2000)
    });

    it("Request For Physical Credit Card", () => {

        // Click on the my card icon
        cy.get('ul > :nth-child(3) > a > .icon').click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click()
        cy.log("User clicked on the credit card tab");
        cy.wait(2000)

        // Click on the  Request Physical Card  tab/button
        cy.get('[class="mat-focus-indicator blockCard mat-stroked-button mat-button-base"]').eq(0).click({ force: true })

        cy.get('form').then((addressPage) => {

            // Click on the Permanent Address radio
            cy.wrap(addressPage).find(this.physicalCard.PermanentAddress).click()
            // cy.get('#mat-radio-3 > .mat-radio-label > .mat-radio-label-content > .row > .loan-It-seems').click()
        })

        // Click on the Proceed button
        cy.get('[class="col-md-12 proceed-btn-container"] [type="submit"]').click()
        cy.wait(2000)

        //  Enter OTP number
        cy.get('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
            cy.wrap(enterOTP).first().type(this.physicalCard.OTP)
            cy.log("User entered OTP : " + this.physicalCard.OTP)
        })

        // Click on the Verify button
        cy.get('[class="btn proceed-btn"]').click()
        cy.log("User clicked on Verify button")

        // Verify message
        cy.get('[class="mat-dialog-content"]').then((successCard) => {
            cy.wrap(successCard).find('[class="congratulations-tag mat-dialog-content"]').should('contain', "You have successfully requested for physical Platinum credit card. Your card will be delivered to your address within 7 working days.")

            cy.wrap(successCard).find('[class="success-image"]').should('be.visible')
            cy.wrap(successCard).should('contain', 'Congratulations')

            // Click on Close button
            cy.wrap(successCard).find('[class="button close-button"]').click()
        })
    })
})