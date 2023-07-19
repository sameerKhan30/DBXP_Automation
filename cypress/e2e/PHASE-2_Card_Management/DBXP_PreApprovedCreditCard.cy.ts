describe('Apply Loan Automation', () => {
    before('Read Data From Fixture File', () => { // Read Data From Fixture File
        cy.fixture('Login.json').then(setLoginData => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData
        })
        cy.fixture('PreApprovedCard.json').then(setPreApprovedData => { // Take Sigle File From (ApplyLoan.json) Fixture File
            this.preApproved = setPreApprovedData
        })
    })

    beforeEach('Login', () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, 'Login')
    })

    it('Apply Pre Approved Credit Card', () => {
        cy.scrollTo('bottom')
        // cy.get("button.apply-now-preApprovedCard").click();
        cy.get('[class="col description-column"] [type="button"]').last().click()

        // Verify dropdown title
        cy.get('[class="chooseCreditLabel"]').should('contain', 'Choose Credit Card Type')
        cy.wait(2000)

        cy.get('.mat-select-placeholder').click()
        cy.get('[role="option"]').each(creditCardType => {
            const cardTypes = creditCardType.text().trim()
            cy.log('Card Types : ' + cardTypes)

            if (cardTypes.includes(this.preApproved.cardType)) {
                cy.wrap(creditCardType).click()

                // Get card offer details
                cy.get('[class="col-md-8 alignItem_ltr"]').then($offerCardDetails => {
                    const cardOffers = $offerCardDetails.find('[class="offer-details"]').eq(0).text().trim()
                    cy.log(cardOffers)

                    // Get joining fee
                    const cardFee = $offerCardDetails.find('[class="offer-details"]').eq(1).text().trim()
                    cy.log(cardFee)

                    // Get card details
                    cy.get('[class="card-div"]').then(($cardDetails) => { // Get card number
                        const cardNumber = $cardDetails.find('[class="card-number cardNumber_contain_only_number ng-star-inserted"]').text().trim()
                        cy.log('Card Number: ' + cardNumber)

                        // Get expiry date
                        const expiryDate = $cardDetails.find('[class="expiry-text"]').text().trim()
                        cy.log('Expiry Date : ' + expiryDate)

                        // Get user name
                        const cardHolderName = $cardDetails.find('.name-text').text().trim()
                        cy.log('User Name: ' + cardHolderName)

                        // Get card type
                        const cardType = $cardDetails.find('[class="card-type"]').text().trim()
                        cy.log('Card Type: ' + cardType)

                        const userCardDetails = {
                            cardOffers,
                            cardFee,
                            cardNumber,
                            expiryDate,
                            cardHolderName,
                            cardType
                        }
                        // Write card details
                        cy.writeFile('cypress\\fixtures\\PreApprovedCardDetails.json', userCardDetails)
                    })
                })
            }
        })

        // Click on checkbox
        cy.get('[class="mat-checkbox-layout"] [type="checkbox"]').check({ force: true })

        // Click on Proceed button
        cy.get('.mat-stepper-next').click()

        // Capture page details/elements
        cy.get('form').then((pageDetails) => { // Validate Name field
            cy.wrap(pageDetails.find('[formcontrolname="name"]')).should("be.visible");

            // Validate Date of Birth field
            cy.wrap(pageDetails.find('[formcontrolname="dob"]')).should("be.visible");

            // Validate Mobile Number field
            cy.wrap(pageDetails.find('[formcontrolname="mobile"]')).should("be.visible")

            // Enter PAN Number
            const PAN = "AZSXD4403L"
            cy.wrap(pageDetails).find('[formcontrolname="panNumber"]').type(PAN)
            cy.log("Entered PAN Number : " + PAN)

            // Click on Proceed button
            cy.wrap(pageDetails.find('button[class="btn submit-button float_rtl"]')).click()
            cy.wait(2000)

            // Enter OTP Number
            const OTP = "123456"
            cy.get('input[autocomplete="one-time-code"]').then((enterOTP) => {
                cy.wrap(enterOTP).first().type(OTP);
                cy.log("User entered OTP : " + OTP);

                cy.wait(2000)

                // Click on Verify button
                cy.get('[class="mat-focus-indicator btn submit-button mat-stroked-button mat-button-base float_rtl"]').click()
            });
        });
    })
})
