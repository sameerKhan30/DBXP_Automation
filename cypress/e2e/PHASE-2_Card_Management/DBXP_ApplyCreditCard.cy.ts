describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        cy.fixture("ApplyCreditCard.json").then((setApplyCreditCardData) => {
            // Take data form ApplyCreditCard.json file
            this.applyCreditCardData = setApplyCreditCardData;
        });
    });

    beforeEach("Login", () => {
        cy.login(
            this.loginData.IM.userName,
            this.loginData.IM.userPassword,
            "Login"
        );
    });

    it("Apply Credit Card", () => {
        // Click on the my card icon
        cy.get("ul > :nth-child(3) > a > .icon").click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click();
        cy.log("User clicked on the credit card tab");
        cy.wait(2000);

        // Click on the credit card card
        cy.get('[routerlink="/my-cards/apply-credit-card"]').click({ force: true });

        // Verify dropdown title
        cy.get('[class="firstStepperLabel"]').should(
            "contain",
            "Choose Credit Card Type"
        );
        cy.wait(2000);

        cy.get("div")
            .find('[panelclass="applyCreditFirst"]')
            .then((dropdown) => {
                cy.wrap(dropdown).click();

                cy.get('[role="listbox"]').each((dropdDownItems) => {
                    const items = dropdDownItems.text().trim();
                    cy.log("Dropdown items: " + items);

                    if (items.includes(this.applyCreditCardData.creditCardType)) {
                        cy.wrap(dropdDownItems).click();
                    }
                });
            });

        // validate card offer - PAGE (1)
        cy.get('[class="col-md-4 form-group credit_offer"]').then(
            ($offerCardDetails) => {
                // Get card offer details
                const cardOffers = $offerCardDetails
                    .find('[class="credit_offer1"]')
                    .text()
                    .trim();
                cy.log(cardOffers);

                // Get joining fee
                const cardFee = $offerCardDetails
                    .find('[class="joining_fee1"]')
                    .text()
                    .trim();
                cy.log(cardFee);

                // Validate card details
                cy.get('[class="card_en"]').then(($cardDetails) => {
                    // Get card number
                    const cardNumber = $cardDetails
                        .find(
                            '[class="card-number cardNumber_contain_only_number ng-star-inserted"]'
                        )
                        .text()
                        .trim();
                    cy.log("Card Number: " + cardNumber);

                    // Get expiry date
                    const expiryDate = $cardDetails
                        .find('[class="expiry-text"]')
                        .text()
                        .trim();
                    cy.log("Expiry Date : " + expiryDate);

                    // Get user name
                    const cardHolderName = $cardDetails.find(".name-text").text().trim();
                    cy.log("User Name: " + cardHolderName);

                    // Get card type
                    const cardType = $cardDetails
                        .find('[class="card-type"]')
                        .text()
                        .trim();
                    cy.log("Card Type: " + cardType);

                    const userCardDetails = {
                        cardOffers,
                        cardFee,
                        cardNumber,
                        expiryDate,
                        cardHolderName,
                        cardType,
                    };

                    // Write card details
                    cy.writeFile(
                        "cypress\\fixtures\\PHASE-2_Credit Card\\ApplyCreditCard.json",
                        userCardDetails
                    );
                });

                // Click on checkbox
                cy.get('span [type="checkbox"][id="mat-checkbox-1-input"]').check({
                    force: true,
                });

                // Click on proceed button
                cy.get('[ng-reflect-ng-class="floatRight"]').click();
            }
        );

        // Enter Your Details - PAGE (2)

        // Verify page hearder title
        cy.get('[class="h-personal-details"]').should(
            "contain",
            " Enter Your Details"
        );

        // Capture page details/elements

        // Validate Name field
        cy.get('[class="user-details-card userDetails_en"]').then((pageDetails) => {
            cy.wrap(pageDetails.find('[formcontrolname="name"]')).should(
                "be.visible"
            );
        });
        // Validate Date of Birth field
        cy.get('[class="user-details-card userDetails_en"]').then((pageDetails) => {
            cy.wrap(pageDetails.find('[formcontrolname="dob"]')).should("be.visible");
        });
        // Validate Mobile Number field
        cy.get('[class="user-details-card userDetails_en"]').then((pageDetails) => {
            cy.wrap(pageDetails.find('[formcontrolname="mobile"]')).should(
                "be.visible"
            );
        });

        // Click on Employement Type dropdown
        cy.get('[ng-reflect-name="employementType"]').click();
        cy.get('[role="option"] span').each((employementType) => {
            const employementTypeList = employementType.text().trim();
            cy.log("Employement Type : " + employementTypeList);

            if (
                employementTypeList.includes(this.applyCreditCardData.employementType)
            ) {
                cy.wrap(employementType).click();
                cy.log(
                    "Selected employement type: " +
                    this.applyCreditCardData.employementType
                );

                // Select currency type
                cy.wait(2000);
                cy.get('[formcontrolname="selectCurrency"]').click();
                // cy.wait(500)
                cy.get('[role="option"] span').each((listCurrency) => {
                    //  Getting text of all the currency
                    const currencyText = listCurrency.text().trim();
                    cy.log("Currency Type is - ", currencyText);

                    // Passing cundition to click on the given currency name
                    if (currencyText.includes(this.applyCreditCardData.currency)) {
                        cy.wrap(listCurrency).click();
                        cy.wrap(listCurrency).should("contain", currencyText);
                        cy.log(
                            "User is selected currency is- " +
                            this.applyCreditCardData.currency
                        );

                        // Enter monthly income
                        cy.get('[formcontrolname="monthlyIncome"]').type(
                            this.applyCreditCardData.monthlyIncome
                        );

                        // Enter PAN Number
                        cy.get('[formcontrolname="panNumber"]').type(
                            this.applyCreditCardData.panNumber
                        );

                        //  Click on Checkbox
                        cy.get('span [type="checkbox"][id="mat-checkbox-2-input"]').check({
                            force: true,
                        });

                        // // Click on proceed button
                        cy.get(
                            '[class="mat-stepper-next btn proceed-button floatCommon_en"][type="submit"]'
                        ).click();

                        // Upload Documents

                        cy.get('label input[type="file"]').then((uploadDocument) => {
                            //  Getting the length of the document
                            // let uploadDocumentLength = uploadDocument.length.toString();
                            let uploadDocumentLength = uploadDocument.length;
                            cy.log("The length of the document is: " + uploadDocumentLength);

                            //  Uplpload 3 documents
                            if (uploadDocumentLength == 3) {
                                cy.wait(1000);
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(0)
                                    .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                                cy.get('[class="successfully-msg"]')
                                    .eq(0)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");
                                cy.wait(1000);
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(1)
                                    .selectFile(
                                        "cypress\\e2e\\UploadDocs\\kaung-myat-min-n39-bU4c5kQ-unsplash.jpg"
                                    );
                                cy.get('[class="successfully-msg"]')
                                    .eq(1)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");
                                cy.wait(1000);
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(2)
                                    .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                                cy.get('[class="successfully-msg"]')
                                    .eq(2)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");
                            }
                            // Uplpload 2 documents
                            else if (uploadDocumentLength == 2) {
                                cy.wait(1000);
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(0)
                                    .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                                cy.get('[class="successfully-msg"]')
                                    .eq(0)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");

                                cy.wait(1000);
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(1)
                                    .selectFile(
                                        "cypress\\e2e\\UploadDocs\\kaung-myat-min-n39-bU4c5kQ-unsplash.jpg"
                                    );
                                cy.get('[class="successfully-msg"]')
                                    .eq(1)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");
                            }
                            //Uplpload 1 documents
                            else if (uploadDocumentLength == 1) {
                                cy.get('[class="custom-file-input form-control"]')
                                    .eq(0)
                                    .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                                cy.get('[class="successfully-msg"]')
                                    .eq(0)
                                    .should("be.visible")
                                    .and("contain", " Successfully uploaded ");
                            }

                            //Clicking on the Submit button
                            cy.get(
                                'button[class="btn proceed-button floatCommon_en ng-star-inserted"]'
                            ).click();

                            //  Enter OTP number
                            cy.get(
                                '[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]'
                            ).then((enterOTP) => {
                                cy.wrap(enterOTP).first().type(this.applyCreditCardData.OTP);
                                cy.log("User entered OTP : " + this.applyCreditCardData.OTP);
                            });

                            // Click on the Verify button
                            cy.get(
                                '[class="btn proceed-button floatCommon_en ng-star-inserted"]'
                            ).click();
                            cy.log("User clicked on Verify button");

                            // Click on the Closde button
                            cy.wait(2000);
                            cy.get('[class="close-btn"]').click();
                        });
                    }
                });
            }
        });
    });
});
