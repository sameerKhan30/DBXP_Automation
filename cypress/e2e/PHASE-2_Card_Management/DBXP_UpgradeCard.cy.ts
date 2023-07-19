describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
        cy.fixture("CreditCardDetails.json").then((getUpgradeCard) => {
            // Take Sigle File From (ApplyLoan.json) Fixture File
            this.physicalCard = getUpgradeCard;
        });
    })

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");


    });

    it("Upgrade Credit Card", () => {

        // Click on the my card icon
        cy.get('ul > :nth-child(3) > a > .icon').click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click()
        cy.log("User clicked on the credit card tab");
        cy.wait(500)


        // Click on the  Upgrade Card  tab/button
        cy.get('[routerlink="/my-cards/upgrade-card-request"]').click({ force: true })

        cy.get('form').then((upgradeCardPage) => {
            cy.wrap(upgradeCardPage).should('contain', 'Existing Credit Card')
            cy.wait(2000)
            cy.wrap(upgradeCardPage).find('[panelclass="myPanelClassDropdown"]').click()
            cy.get('[role="option"]').each((cardList) => {
                const upgradeTypes = cardList.text().trim()
                cy.log(upgradeTypes)

                if (upgradeTypes.includes("Platinum Credit Card")) {
                    cy.wrap(cardList).click()
                    cy.wait(500)
                }

                // Get all details of card
                cy.get("div")
                    .find('[class="card-div"]')
                    .then(($carddata) => {
                        const cardNumber = $carddata.find('[ng-reflect-ng-class="cardNumber_contain_only_number"]').first().text().trim();
                        cy.log("Card number : " + cardNumber)

                        const expiryDate = $carddata.find('[class="expiry-text"]').first().text().trim();
                        cy.log("Expiry date : " + expiryDate)

                        const cardHolderName = $carddata.find('[class="name-text"]').text().trim()
                        cy.log("User name : " + cardHolderName)

                        const cardType = $carddata.find('div [class="creditTypes cardCredit_ltr"]').text().trim()
                        cy.log("Card Type : " + cardType)

                        // Get card offers
                        // const cardOffers = $carddata.find('[class="credit_offer1"] p').text().trim();
                        // cy.log("Card offer is ", cardOffers);

                        // Get joining fee
                        // const joiningFeeAndAnualFee = $carddata.find('.demo-card-container-ltr > app-credit-card > .card-div > .visa-logo > .card-type').first().text().trim();
                        // cy.log("Joining fee and anual fee is " + joiningFeeAndAnualFee);

                        // Write all details of card in json file
                        const cardDatails = {
                            // cardOffers,
                            // joiningFeeAndAnualFee,
                            cardNumber,
                            expiryDate,
                            cardHolderName,
                            cardType
                        }

                        cy.writeFile("cypress\\fixtures\\UpgradeCard.json", [cardDatails])
                        cy.scrollTo('bottom')

                        // Click on the checkbox
                        cy.get('[class="mat-checkbox-input cdk-visually-hidden"]')
                            .should("not.be.checked")
                            .check({ force: true })
                            .should("be.checked");

                        // Click on Proceed button
                        cy.get('[class="btn proceed-btn proceed-btn-ltr proceedBtnValid"]').click()

                        //  Enter OTP number
                        cy.get('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
                            cy.wrap(enterOTP).first().type(this.physicalCard.OTP)
                            cy.log("User entered OTP : " + this.physicalCard.OTP)
                        })

                        // Click on the proceed button
                        cy.get('[class="col-sm-12"] [class="btn proceed-btn proceed-verify-btn"]').click();

                        // validate success page
                        cy.get('[class="card-div"]')
                            .last()
                            .then(($successPage) => {
                                const cardNumberOnSuccessPage = $successPage
                                    .find('[ng-reflect-klass="card-number"]')
                                    .last()
                                    .text()
                                    .trim();
                                const expiryDateOfCardOnSuccessPage = $successPage
                                    .find('[class="expiry-text"]')
                                    .last()
                                    .text()
                                    .trim();
                                const cardHolderNameOnSuccessPage = $successPage
                                    .find('[class="name-text"]')
                                    .last()
                                    .text()
                                    .trim();
                                const successPageCardData = {
                                    cardNumberOnSuccessPage,
                                    expiryDateOfCardOnSuccessPage,
                                    cardHolderNameOnSuccessPage,
                                };
                                cy.writeFile(
                                    "cypress\\fixtures\\UpgradeCard.json",
                                    [successPageCardData],
                                    {
                                        flag: "a+",
                                    }
                                );
                                cy.get('[class="green-tick-img"]').should("be.visible");
                                // cy.get('[class="card-heading"]')
                                //     .should("be.visible")
                                //     .and("contain", this.creditCardData.UpgradeCard_Request.Success);
                                // cy.get('[class="card-successMsg"]').should("be.visible");
                                // cy.get("button.closeButton").click();
                            });

                    })
            })
        })
    })








})